import { useState, useEffect } from "react";
import { History as HistoryIcon, ArrowRight, Calendar, Tag, ShieldCheck, Database, Disc, Activity, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { NeuralStorage, Problem } from "@/lib/storage";

export function HistoryPage() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadedProblems = NeuralStorage.getProblems();
    setProblems(loadedProblems);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] bg-background gap-8">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-2 border-accent border-t-transparent rounded-full shadow-[0_0_20px_rgba(99,102,241,0.2)]"
        />
        <div className="tagline tracking-[0.5em] !mb-0">Decrypting Synaptic Records</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground pt-40 pb-32">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row justify-between items-start mb-32 gap-12 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-6 mb-10">
              <div className="w-20 h-20 rounded-[32px] bg-white/[0.03] border border-white/10 flex items-center justify-center shadow-2xl">
                <Database className="text-accent" size={32} />
              </div>
              <div className="h-12 w-px bg-white/10 hidden sm:block" />
              <div className="text-[10px] font-black uppercase tracking-[0.6em] text-accent italic opacity-60">Strategic Repository</div>
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter uppercase italic leading-[0.85] mb-8">
               Intelligence <br /> <span className="text-accent underline decoration-white/10 underline-offset-[20px]">Archives.</span>
            </h1>
            <p className="text-xl text-white/30 font-black uppercase tracking-[0.05em] max-w-xl italic leading-tight">
              Manage and re-initialize high-fidelity tactical roadmap records from your decentralized neural database.
            </p>
          </div>

          <div className="flex flex-col items-end gap-4 relative z-10">
            <div className="px-8 py-5 bg-white/[0.03] rounded-[32px] border border-white/5 flex items-center gap-6 shadow-2xl">
              <Lock className="text-emerald-500" size={24} />
              <div className="text-right">
                <div className="text-[10px] font-black uppercase tracking-widest text-white/20 italic">Vulnerability Status</div>
                <div className="text-sm font-black text-white tracking-widest uppercase italic">Secured // AES-GCM</div>
              </div>
            </div>
            <div className="text-[9px] font-black uppercase tracking-[0.4em] text-white/10 italic">Core Synchronization: Online</div>
          </div>

          {/* Background Atmosphere */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 blur-[120px] rounded-full -mr-32 -mt-32" />
        </div>

        <div className="grid gap-10">
          <AnimatePresence mode="popLayout">
            {problems.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-60 glass-card border-dashed bg-transparent border-white/10"
              >
                <Disc className="mx-auto mb-10 text-white/5 animate-pulse" size={80} />
                <div className="tagline justify-center">Archives Nullified</div>
                <Link to="/" className="mt-8 btn-primary inline-flex">Initialize Protocol</Link>
              </motion.div>
            ) : (
              problems.map((p, index) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="group relative overflow-hidden glass-card !bg-white/[0.02] border-white/5 p-12 hover:bg-white/[0.05] hover:border-accent/30 transition-all duration-700">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-accent/5 blur-[100px] rounded-full -mr-40 -mt-40 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                    
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-16 relative z-10">
                      <div className="flex-1 space-y-8">
                        <div className="flex items-center gap-6">
                          <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-white/20 italic">
                            <Calendar size={14} className="text-accent" />
                            {new Date(p.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </div>
                          <div className="w-1 h-1 rounded-full bg-white/10" />
                          <div className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 italic">Hash: {p.id.toUpperCase()}</div>
                        </div>
                        
                        <h3 className="text-3xl md:text-4xl font-black text-white tracking-tighter uppercase italic leading-tight max-w-3xl">
                          {p.problemText}
                        </h3>
                        
                        <div className="flex flex-wrap gap-4">
                          {p.data?.categories?.map((cat: string) => (
                            <span key={cat} className="flex items-center gap-3 px-5 py-2.5 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-white/40 italic group-hover:text-white transition-colors">
                               <div className="w-1.5 h-1.5 bg-accent rounded-full shadow-[0_0_8px_#6366f1]" />
                               {cat}
                            </span>
                          ))}
                          <span className="px-5 py-2.5 bg-emerald-500/10 text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-[0.3em] border border-emerald-500/20 italic">Verified Architecture</span>
                        </div>
                      </div>
                      
                      <Link 
                        to="/flow" 
                        state={{ problem: p.problemText }}
                        className="btn-primary flex items-center gap-4 group/btn !py-4"
                      >
                        <span className="italic">Restore Synthesis</span>
                        <ArrowRight size={20} className="group-hover/btn:translate-x-2 transition-transform duration-500" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
