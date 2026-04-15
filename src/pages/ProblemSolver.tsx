import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Sparkles, CheckCircle2, Clock, DollarSign, Wrench, ArrowRight, Save, BrainCircuit, Tag, Target } from "lucide-react";
import { analyzeProblem } from "@/services/aiService";
import { GlassCard } from "@/components/GlassCard";
import { Mermaid } from "@/components/Mermaid";
import { db, auth } from "@/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export function ProblemSolver() {
  const location = useLocation();
  const navigate = useNavigate();
  const [problemText, setProblemText] = useState(location.state?.problem || "");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (problemText && !result) {
      handleAnalyze();
    }
  }, []);

  const handleAnalyze = async () => {
    if (!problemText) return;
    setLoading(true);
    setError(null);
    try {
      const data = await analyzeProblem(problemText);
      setResult(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to analyze problem. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleConvertToActions = async () => {
    if (!result || !auth.currentUser) return;
    setSaving(true);
    try {
      // Save problem
      const problemRef = await addDoc(collection(db, "problems"), {
        userId: auth.currentUser.uid,
        problemText,
        ...result,
        createdAt: serverTimestamp(),
      });

      // Save daily tasks
      const taskPromises = result.dailyTasks.map((taskText: string) => 
        addDoc(collection(db, "tasks"), {
          userId: auth.currentUser.uid,
          problemId: problemRef.id,
          text: taskText,
          completed: false,
          difficulty: result.effort,
          createdAt: serverTimestamp(),
        })
      );

      await Promise.all(taskPromises);
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      alert("Failed to save actions.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full mx-auto mb-8"
        />
        <h2 className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">Strategizing your solution...</h2>
        <p className="text-slate-500 font-medium">Our AI is breaking down your problem into actionable steps.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <div className="bg-red-50 border border-red-100 p-10 rounded-[32px] shadow-xl">
          <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Wrench className="text-red-600" size={32} />
          </div>
          <h2 className="text-2xl font-black text-red-900 mb-4">Analysis Interrupted</h2>
          <p className="text-red-700/80 mb-8 leading-relaxed font-medium">{error}</p>
          <button 
            onClick={handleAnalyze}
            className="bg-red-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!result) return null;

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 bg-white">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-16">
        <div>
          <div className="tagline">Strategy Blueprint</div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Execution Roadmap</h1>
        </div>
        <button 
          onClick={handleConvertToActions}
          disabled={saving}
          className="btn-primary flex items-center gap-2 px-8 py-4 text-base"
        >
          {saving ? "Saving Roadmap..." : "Convert to Action Mode"}
          <ArrowRight size={20} />
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* Left Column: Overview */}
        <div className="lg:col-span-1 space-y-8">
          <GlassCard className="p-8 border-slate-200">
            <h3 className="text-[10px] font-bold text-accent uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              <Tag size={14} /> Categories
            </h3>
            <div className="flex flex-wrap gap-2">
              {result.categories.map((cat: string) => (
                <span key={cat} className="px-4 py-1.5 bg-slate-50 border border-slate-200 rounded-full text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  {cat}
                </span>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-8 border-slate-200">
            <h3 className="text-[10px] font-bold text-accent uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              <BrainCircuit size={14} /> Root Cause
            </h3>
            <p className="text-slate-600 leading-relaxed font-medium">{result.rootCause}</p>
          </GlassCard>

          <div className="grid grid-cols-2 gap-4">
            <GlassCard className="p-6 border-slate-200 text-center">
              <Clock size={20} className="text-accent mx-auto mb-3" />
              <div className="text-[10px] font-bold uppercase text-slate-400 tracking-widest mb-1">Effort</div>
              <div className="text-xl font-black text-slate-900">{result.effort}</div>
            </GlassCard>
            <GlassCard className="p-6 border-slate-200 text-center">
              <DollarSign size={20} className="text-accent mx-auto mb-3" />
              <div className="text-[10px] font-bold uppercase text-slate-400 tracking-widest mb-1">Cost</div>
              <div className="text-xl font-black text-slate-900">{result.cost || "Free"}</div>
            </GlassCard>
          </div>
        </div>

        {/* Right Column: Steps & Timeline */}
        <div className="lg:col-span-2 space-y-12">
          <section>
            <h2 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                <CheckCircle2 className="text-accent" size={20} />
              </div>
              Execution Steps
            </h2>
            <div className="space-y-4">
              {result.steps.map((step: any, i: number) => (
                <GlassCard key={i} className="flex gap-6 items-start p-6 border-slate-100 hover:border-accent/30 hover:shadow-md transition-all">
                  <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black shrink-0 shadow-lg">
                    {i + 1}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 mb-2 leading-tight">{step.title}</h4>
                    <p className="text-slate-500 font-medium leading-relaxed">{step.description}</p>
                  </div>
                </GlassCard>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                <Sparkles className="text-accent" size={20} />
              </div>
              Timeline
            </h2>
            <div className="border-l-4 border-slate-100 ml-5 pl-10 space-y-10">
              {result.timeline.map((item: any, i: number) => (
                <div key={i} className="relative">
                  <div className="absolute -left-[54px] top-1 w-6 h-6 rounded-full bg-accent border-4 border-white shadow-lg" />
                  <div className="text-[11px] font-black text-accent uppercase tracking-[0.2em] mb-2">{item.period}</div>
                  <p className="text-lg font-bold text-slate-800 leading-snug">{item.goal}</p>
                </div>
              ))}
            </div>
          </section>

          {result.mermaidChart && (
            <section>
              <h2 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                  <Target className="text-accent" size={20} />
                </div>
                Strategy Mindmap
              </h2>
              <Mermaid chart={result.mermaidChart} />
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
