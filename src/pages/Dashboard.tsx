import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, Circle, Clock, Target, TrendingUp, Calendar, Trash2, Award, ArrowRight, BrainCircuit, Activity, Database, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { NeuralStorage, Task } from "@/lib/storage";

function LaunchCard({ title, desc, icon, to }: { title: string; desc: string; icon: React.ReactNode; to: string }) {
  return (
    <Link to={to} className="group">
      <div className="glass-card p-10 h-full border-white/5 bg-white/[0.03] hover:bg-white/10 transition-all flex flex-col justify-between overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-accent/10 transition-colors" />
        <div>
          <div className="w-16 h-16 rounded-[24px] bg-white/5 border border-white/10 flex items-center justify-center mb-10 group-hover:scale-110 group-hover:bg-accent/20 transition-all duration-700">
            {icon}
          </div>
          <h3 className="text-2xl font-black text-white mb-4 leading-none uppercase tracking-tighter italic">{title}</h3>
          <p className="text-[13px] font-bold text-muted-foreground uppercase tracking-wide leading-relaxed mb-10 opacity-60">{desc}</p>
        </div>
        <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-accent/60 group-hover:text-accent transition-colors">
          Initialize <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}

export function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadedTasks = NeuralStorage.getTasks();
    setTasks(loadedTasks);
    setLoading(false);
  }, []);

  const toggleTask = (taskId: string, currentStatus: boolean) => {
    NeuralStorage.updateTask(taskId, { completed: !currentStatus });
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, completed: !currentStatus } : t));
  };

  const deleteTask = (taskId: string) => {
    NeuralStorage.deleteTask(taskId);
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const progress = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] bg-background gap-8">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-accent"></div>
        <div className="tagline tracking-[0.6em] !mb-0">Synchronizing Terminal Data</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row justify-between items-end gap-12 mb-24">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="tagline !text-accent opacity-80">Strategic Command Center</div>
              <div className="px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-2 bg-accent/10 text-accent border border-accent/20">
                <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse shadow-[0_0_8px_#6366f1]" />
                System: Optimal
              </div>
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter uppercase leading-[0.85] italic">Neural <br /> Progress.</h1>
            <p className="text-lg font-black text-white/30 uppercase tracking-[0.3em] italic">Architecting 128-bit clarity in real-time execution.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 w-full md:w-auto">
            <div className="flex items-center gap-16 px-16 py-10 glass-card bg-white/[0.02] border-white/5 shadow-2xl">
              <div className="text-center">
                <div className="text-6xl font-black text-accent tracking-tighter italic">{progress}%</div>
                <div className="text-[10px] uppercase tracking-[0.4em] text-white/20 font-black mt-3">Efficiency</div>
              </div>
              <div className="w-px h-20 bg-white/5" />
              <div className="text-center">
                <div className="text-6xl font-black text-white tracking-tighter italic">{tasks.length}</div>
                <div className="text-[10px] uppercase tracking-[0.4em] text-white/20 font-black mt-3">Active Nodes</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          <LaunchCard 
            title="Deconstruct" 
            desc="Shatter complex problems into an atomic horizontal matrix." 
            icon={<BrainCircuit className="text-accent" size={32} />}
            to="/"
          />
          <LaunchCard 
            title="Strategic Vault" 
            desc="Access high-fidelity roadmaps and encrypted tactical data." 
            icon={<Database className="text-purple-500" size={32} />}
            to="/history"
          />
          <LaunchCard 
            title="Active Sync" 
            desc="Manage execution paths and synchronize unit protocols." 
            icon={<Activity className="text-emerald-500" size={32} />}
            to="/dashboard"
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-24">
          <div className="lg:col-span-2 space-y-12">
            <h2 className="text-3xl font-black text-white flex items-center gap-6 mb-12 uppercase tracking-tighter italic">
              <div className="w-16 h-16 rounded-[28px] bg-accent/20 flex items-center justify-center border border-accent/30 shadow-2xl shadow-accent/10">
                <Target className="text-accent" size={28} />
              </div>
              Tactical Roadmap
            </h2>
            
            <div className="space-y-6">
              <AnimatePresence mode="popLayout">
                {tasks.length > 0 ? (
                  tasks.map((task) => (
                    <motion.div
                      key={task.id}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ 
                        opacity: task.completed ? 0.3 : 1, 
                        x: 0
                      }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className={cn(
                        "group p-10 flex items-center gap-10 glass-card border-white/5 bg-white/[0.02] hover:bg-white/[0.05]",
                        !task.completed && "hover:border-accent/40 hover:shadow-[0_20px_50px_rgba(0,0,0,0.2)] hover:translate-x-2"
                      )}
                    >
                      <button 
                        onClick={() => toggleTask(task.id, task.completed)}
                        className="text-accent transition-all duration-300"
                      >
                        <motion.div initial={false} animate={{ scale: task.completed ? [1, 1.2, 1] : 1 }}>
                          {task.completed ? (
                            <CheckCircle2 size={36} className="fill-accent text-background" />
                          ) : (
                            <Circle size={36} className="text-white/10 group-hover:text-accent transition-all" />
                          )}
                        </motion.div>
                      </button>
                      
                      <div className="flex-1">
                        <h3 className={cn(
                          "text-2xl font-black text-white uppercase tracking-tight transition-all duration-500 italic",
                          task.completed && "line-through opacity-40"
                        )}>
                          {task.text}
                        </h3>
                        <div className="flex items-center gap-8 mt-4">
                          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 flex items-center gap-3 italic">
                            <Clock size={14} className="text-accent" /> {task.difficulty || 'Normal Ops'}
                          </span>
                          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 flex items-center gap-3 italic">
                            <Database size={14} className="text-purple-500" /> Latency: 42ms
                          </span>
                        </div>
                      </div>

                      <button 
                        onClick={() => deleteTask(task.id)}
                        className="opacity-0 group-hover:opacity-100 p-4 text-white/10 hover:text-red-500 hover:bg-red-500/10 rounded-2xl transition-all"
                      >
                        <Trash2 size={28} />
                      </button>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-40 glass-card border-dashed border-white/5 bg-transparent">
                    <div className="w-24 h-24 bg-white/5 rounded-[40px] flex items-center justify-center mx-auto mb-10">
                      <Sparkles className="text-white/10" size={48} />
                    </div>
                    <div className="tagline justify-center">No Active Units Detected</div>
                    <Link to="/" className="mt-8 btn-primary inline-flex">Initialize Synthesis Matrix</Link>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="space-y-20">
            <h2 className="text-3xl font-black text-white flex items-center gap-6 mb-12 uppercase tracking-tighter italic">
              <div className="w-16 h-16 rounded-[28px] bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                <TrendingUp className="text-purple-500" size={28} />
              </div>
              Neural Health
            </h2>
            
            <div className="glass-card p-12 border-white/5 bg-white/[0.01]">
              <h3 className="font-black text-white/20 mb-12 uppercase tracking-[0.4em] text-[10px] italic">Synaptic Frequency</h3>
              <div className="h-48 flex items-end gap-4">
                {[40, 70, 45, 90, 65, 30, 50].map((h, i) => (
                  <div key={i} className="flex-1 bg-white/5 rounded-[20px] relative group h-full">
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      transition={{ delay: i * 0.1, duration: 1.5, ease: "circOut" }}
                      className="absolute bottom-0 left-0 right-0 bg-accent/20 group-hover:bg-accent/40 rounded-b-[20px] transition-colors"
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-10 text-[9px] font-black text-white/10 uppercase tracking-[0.3em]">
                <span>Log_Start</span>
                <span>//</span>
                <span>Log_End</span>
              </div>
            </div>

            <div className="p-14 bg-accent text-white border-none rounded-[56px] relative overflow-hidden group cursor-pointer hover:scale-[1.02] transition-all shadow-[0_40px_80px_-20px_rgba(99,102,241,0.2)]">
              <div className="absolute top-0 right-0 w-56 h-56 bg-white/10 blur-[80px] rounded-full -mr-28 -mt-28 group-hover:bg-white/20 transition-colors" />
              <h3 className="font-black mb-8 text-3xl tracking-tighter uppercase italic leading-[0.85]">Cognitive <br /> Peak State.</h3>
              <p className="text-white/80 font-black uppercase tracking-widest text-[10px] leading-relaxed">
                Decomposing tasks into sub-atomic segments triggers immediate dopaminergic reward loops.
              </p>
              <div className="mt-12 flex items-center gap-4 font-black text-[10px] uppercase tracking-[0.4em]">
                System Analytics <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
