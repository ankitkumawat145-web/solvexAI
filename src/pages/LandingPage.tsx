import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import { useRef, useState, useEffect } from "react";
import { 
  BrainCircuit, Target, ArrowRight, Layers, CheckCircle2, ChevronDown, 
  Command, Database, Globe, MousePointer2, ShieldAlert, Zap, Cpu, Sparkles, Activity
} from "lucide-react";
import { ProblemInput } from "@/components/ProblemInput";
import { Footer } from "@/components/Footer";

export function LandingPage() {
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const [showStickySearch, setShowStickySearch] = useState(false);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    const handleScroll = () => {
      setShowStickySearch(window.scrollY > 800);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleProblemSubmit = (text: string) => {
    navigate("/flow", { state: { problem: text } });
  };

  return (
    <div className="relative overflow-hidden bg-background text-foreground font-sans">
      {/* Immersive Atmosphere */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-[1000px] h-[1000px] bg-accent/5 blur-[160px] rounded-full translate-y-[-50%]" />
        <div className="absolute bottom-0 right-1/4 w-[800px] h-[800px] bg-accent-secondary/5 blur-[160px] rounded-full translate-y-[50%]" />
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex flex-col items-center justify-center pt-32 pb-20 px-6">
        <motion.div 
          style={{ y: heroY, opacity: heroOpacity }}
          className="max-w-6xl w-full text-center relative z-10"
        >
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="tagline justify-center mb-10"
          >
            Tactical Architecture Engine // PRO-GRADE
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-7xl md:text-[8rem] font-black leading-[0.85] tracking-tighter uppercase italic mb-12"
          >
            Convert any <br />
            <span className="text-accent underline decoration-accent/20 underline-offset-[20px]">Confusion</span> <br />
            into a <span className="text-accent-secondary">Structured Plan.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-16 font-black uppercase tracking-tight opacity-70 leading-snug"
          >
            AI-powered flow system that deconstructs chaos into a high-fidelity visual roadmap. Show exactly what to do next with professional precision.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="max-w-2xl mx-auto relative group"
          >
            <div className="absolute -inset-10 bg-accent/10 blur-[80px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            <div className="relative glass-card !bg-white/5 p-2">
              <ProblemInput onSubmit={handleProblemSubmit} />
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 text-muted-foreground/30"
        >
          <span className="text-[9px] font-black uppercase tracking-[0.4em]">Initialize Transmission</span>
          <ChevronDown size={20} className="animate-bounce" />
        </motion.div>
      </section>

      {/* Problem-Solution Contrast */}
      <section className="relative py-40 border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-12 text-foreground">
          <ContrastCard 
            title="Confusion" 
            arrow="→" 
            result="Clear Steps" 
            desc="Stop circling in ambiguity. FlowSynth converts vague problems into sharp, actionable paths." 
            icon={<Target size={24} />} 
          />
          <ContrastCard 
            title="Overthinking" 
            arrow="→" 
            result="Structured Flow" 
            desc="Our neural architect breaks down recursive thoughts into a linear, manageable strategy."
            icon={<BrainCircuit size={24} />} 
          />
          <ContrastCard 
            title="No Direction" 
            arrow="→" 
            result="Action Plan" 
            desc="Move from stagnant theory to operational reality with every node mapped and connected."
            icon={<Activity size={24} />} 
          />
        </div>
      </section>

      {/* Horizontal Flow Demo Section */}
      <section className="py-60 px-6 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center mb-32 relative z-10">
          <div className="tagline justify-center mb-8">Live Matrix Overview</div>
          <h2 className="text-6xl md:text-[5rem] font-black tracking-tighter uppercase italic leading-[0.9]">
            Engineered for <br />
            <span className="text-accent underline decoration-white/10 underline-offset-[16px]">Cognitive Clarity.</span>
          </h2>
        </div>

        <div className="max-w-7xl mx-auto py-20 px-8 glass-card border-none bg-white/[0.03] overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background z-20 pointer-events-none" />
          
          <motion.div 
            animate={{ x: [0, -400, 0] }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="flex items-center gap-20 py-20 opacity-50 grayscale hover:grayscale-0 transition-all duration-1000"
          >
            <DemoNode title="Input Problem" icon={<Sparkles />} />
            <DemoConnection />
            <DemoNode title="Analyze Logic" icon={<Activity />} />
            <DemoConnection />
            <DemoNode title="Define Pillars" icon={<Layers />} />
            <DemoConnection />
            <DemoNode title="Tactical Steps" icon={<Cpu />} />
            <DemoConnection />
            <DemoNode title="Execution Goal" icon={<Zap />} />
          </motion.div>
        </div>
      </section>

      {/* High-Fidelity Stats Section */}
      <section className="py-40 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-24">
          <StatItem label="Processing Latency" value="1.2s" sub="Sub-millisecond Logic" />
          <StatItem label="Structural Integrity" value="99.9%" sub="Fault-Tolerant Mapping" />
          <StatItem label="Tactical Nodes" value="450k+" sub="Synthesized Strategies" />
          <StatItem label="Logical Depth" value="L4" sub="Maximized Resolution" />
        </div>
      </section>

      <Footer />
    </div>
  );
}

function ContrastCard({ title, arrow, result, desc, icon }: any) {
  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="p-12 glass-card space-y-8"
    >
      <div className="w-16 h-16 rounded-3xl bg-accent/20 border border-accent/40 flex items-center justify-center text-accent">
        {icon}
      </div>
      <div>
        <div className="flex items-center gap-4 text-xl font-black uppercase tracking-tighter mb-2">
          <span className="opacity-40">{title}</span>
          <span className="text-accent">{arrow}</span>
          <span>{result}</span>
        </div>
        <p className="text-muted-foreground font-medium leading-relaxed uppercase text-[11px] tracking-widest opacity-60">
          {desc}
        </p>
      </div>
    </motion.div>
  );
}

function DemoNode({ title, icon }: any) {
  return (
    <div className="shrink-0 flex flex-col items-center gap-6">
      <div className="w-24 h-24 rounded-[32px] bg-slate-900 border border-white/10 flex items-center justify-center text-white shadow-2xl">
        {icon}
      </div>
      <div className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">{title}</div>
    </div>
  );
}

function DemoConnection() {
  return (
    <div className="w-40 h-[2px] bg-gradient-to-r from-accent/50 to-accent-secondary/50 relative">
      <motion.div 
        animate={{ x: [0, 160] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute top-1/2 -translate-y-1/2 w-8 h-[4px] bg-white blur-[4px]"
      />
    </div>
  );
}

function StatItem({ label, value, sub }: any) {
  return (
    <div className="space-y-4">
      <div className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground opacity-40">{label}</div>
      <div className="text-5xl font-black italic text-white tracking-tighter uppercase">{value}</div>
      <div className="text-[9px] font-black uppercase tracking-[0.2em] text-accent">{sub}</div>
    </div>
  );
}
