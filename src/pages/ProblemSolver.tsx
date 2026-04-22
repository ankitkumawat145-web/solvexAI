import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, CheckCircle2, Clock, DollarSign, Wrench, ArrowRight, Save, BrainCircuit, Tag, Target, Activity, Cpu, ShieldAlert } from "lucide-react";
import { analyzeProblem } from "@/services/aiService";
import { cn } from "@/lib/utils";
import { NeuralStorage } from "@/lib/storage";

export function ProblemSolver() {
  const location = useLocation();
  const navigate = useNavigate();
  const [problemText] = useState(location.state?.problem || "");
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
      setError(err.message || "Strategic Engine Offline. Verify connectivity.");
    } finally {
      setLoading(false);
    }
  };

  const handleConvertToActions = async () => {
    if (!result) return;
    setSaving(true);
    try {
      NeuralStorage.saveProblem(problemText, result);
      
      // Navigate to flow directly for the premium experience
      navigate("/flow", { state: { problem: problemText } });
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center p-6 text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="w-48 h-48 border border-dashed border-accent/20 rounded-full flex items-center justify-center"
        >
          <Cpu size={64} className="text-accent animate-pulse" />
        </motion.div>
        <h2 className="text-4xl font-black text-white mt-16 mb-4 uppercase italic tracking-tighter">Analyzing Vector</h2>
        <div className="tagline !text-accent/60 !mb-0 tracking-[0.6em]">Neural Matrix Generation in Progress</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center p-6">
        <div className="max-w-md p-16 glass-card text-center">
          <ShieldAlert size={80} className="text-accent mx-auto mb-10" />
          <h2 className="text-3xl font-black mb-6 uppercase tracking-tight italic">Engine Error</h2>
          <p className="text-white/40 font-bold mb-12 uppercase tracking-widest text-xs italic">{error}</p>
          <button onClick={handleAnalyze} className="btn-primary w-full">Retry Synthesis</button>
        </div>
      </div>
    );
  }

  if (!result) return null;

  return (
    <div className="min-h-screen bg-background text-foreground pt-32 pb-24 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-accent/5 blur-[150px] rounded-full -mr-64 -mt-64" />
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-12 mb-24 border-b border-white/5 pb-16">
          <div className="space-y-4">
            <div className="tagline !text-accent opacity-80 italic">Summary Report // V-4.2</div>
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase italic leading-none">Strategic Synthesis.</h1>
          </div>
          <button 
            onClick={handleConvertToActions}
            disabled={saving}
            className="btn-primary flex items-center gap-6 px-12 py-5 text-lg group scale-105 active:scale-95 shadow-[0_20px_50px_rgba(99,102,241,0.2)]"
          >
            <span>{saving ? "Encrypting..." : "Launch Visual Matrix"}</span>
            <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-16">
          {/* Left Column: Metrics */}
          <div className="lg:col-span-1 space-y-12">
            <div className="glass-card p-10 space-y-10 bg-white/[0.01] border-white/5">
               <section>
                  <h3 className="text-[10px] font-black text-accent uppercase tracking-[0.4em] mb-6 flex items-center gap-3 italic">
                    <Tag size={16} /> Strategy Domains //
                  </h3>
                  <div className="flex flex-wrap gap-4">
                    {result.categories.map((cat: string) => (
                      <span key={cat} className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-full text-[10px] font-black text-white/50 uppercase tracking-widest italic hover:text-accent transition-colors">
                        {cat}
                      </span>
                    ))}
                  </div>
               </section>

               <div className="h-px bg-white/5 w-full" />

               <section>
                  <h3 className="text-[10px] font-black text-accent uppercase tracking-[0.4em] mb-6 flex items-center gap-3 italic">
                    <BrainCircuit size={16} /> Root Cause Analysis //
                  </h3>
                  <p className="text-lg font-black text-white/60 leading-relaxed tracking-tight italic">{result.rootCause}</p>
               </section>

               <div className="h-px bg-white/5 w-full" />

               <div className="grid grid-cols-2 gap-6">
                  <MetricBox icon={<Clock className="text-accent" />} label="Effort Level" value={result.effort} />
                  <MetricBox icon={<Activity className="text-purple-500" />} label="Latency" value="42ms" />
               </div>
            </div>
          </div>

          {/* Right Column: Steps */}
          <div className="lg:col-span-2 space-y-16">
            <section>
              <h2 className="text-3xl font-black text-white mb-12 flex items-center gap-6 uppercase tracking-tighter italic">
                <div className="w-16 h-16 rounded-[28px] bg-accent/20 flex items-center justify-center border border-accent/20 shadow-2xl shadow-accent/10">
                  <CheckCircle2 className="text-accent" size={28} />
                </div>
                Atomic Step Sequence
              </h2>
              <div className="grid gap-6">
                {result.steps.map((step: any, i: number) => (
                  <div key={i} className="group p-10 flex gap-10 glass-card bg-white/[0.01] border-white/5 hover:bg-white/[0.03] hover:border-accent/40 transition-all duration-700">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 text-white flex items-center justify-center font-black shrink-0 shadow-2xl group-hover:bg-accent group-hover:text-background transition-all italic text-xl">
                      0{i + 1}
                    </div>
                    <div>
                      <h4 className="text-2xl font-black text-white mb-4 leading-none uppercase italic group-hover:text-accent transition-colors">{step.title}</h4>
                      <p className="text-lg text-white/40 font-black uppercase tracking-tight leading-snug italic opacity-80">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricBox({ icon, label, value }: any) {
  return (
    <div className="p-8 bg-white/5 border border-white/5 rounded-[32px] text-center hover:bg-white/10 transition-all">
      <div className="w-12 h-12 bg-background rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-2xl">
        {icon}
      </div>
      <div className="text-[10px] font-black uppercase text-white/20 tracking-[0.4em] mb-2 italic">{label}</div>
      <div className="text-2xl font-black text-white tracking-tighter italic">{value}</div>
    </div>
  );
}
