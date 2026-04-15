import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, Circle, Clock, Target, TrendingUp, Calendar, Trash2, Award, ArrowRight } from "lucide-react";
import { db, auth } from "@/firebase";
import { collection, query, where, onSnapshot, updateDoc, doc, deleteDoc, orderBy } from "firebase/firestore";
import { GlassCard } from "@/components/GlassCard";
import { cn } from "@/lib/utils";

export function Dashboard() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, "tasks"),
      where("userId", "==", auth.currentUser.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const taskData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTasks(taskData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const toggleTask = async (taskId: string, currentStatus: boolean) => {
    try {
      await updateDoc(doc(db, "tasks", taskId), {
        completed: !currentStatus
      });
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      await deleteDoc(doc(db, "tasks", taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const progress = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 bg-white">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
        <div>
          <div className="tagline">Performance Overview</div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Your Progress</h1>
          <p className="text-slate-500 font-medium mt-2">Keep moving forward. One task at a time.</p>
        </div>
        
        <GlassCard className="flex items-center gap-10 px-10 py-6 border-slate-100 shadow-2xl">
          <div className="text-center">
            <div className="text-4xl font-black text-accent">{progress}%</div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-black mt-1">Completion</div>
          </div>
          <div className="w-px h-12 bg-slate-100" />
          <div className="text-center">
            <div className="text-4xl font-black text-slate-900">{tasks.length}</div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-black mt-1">Total Tasks</div>
          </div>
        </GlassCard>
      </div>

      <div className="grid lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
              <Target className="text-accent" size={20} />
            </div>
            Daily Actions
          </h2>
          
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {tasks.length > 0 ? (
                tasks.map((task) => (
                  <motion.div
                    key={task.id}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ 
                      opacity: task.completed ? 0.5 : 1, 
                      y: 0,
                      scale: task.completed ? 0.98 : 1
                    }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                  >
                    <GlassCard 
                      className={cn(
                        "p-6 flex items-center gap-6 group transition-all border-slate-100",
                        task.completed ? "bg-slate-50 border-transparent shadow-none" : "hover:border-accent/30 hover:shadow-xl hover:shadow-accent/5"
                      )}
                    >
                      <button 
                        onClick={() => toggleTask(task.id, task.completed)}
                        className="text-accent transition-all duration-300"
                      >
                        <motion.div
                          initial={false}
                          animate={{ 
                            scale: task.completed ? [1, 1.3, 1] : 1,
                            rotate: task.completed ? [0, 10, -10, 0] : 0
                          }}
                        >
                          {task.completed ? (
                            <CheckCircle2 size={28} className="fill-accent text-white" />
                          ) : (
                            <Circle size={28} className="text-slate-200 group-hover:text-accent group-hover:scale-110 transition-all" />
                          )}
                        </motion.div>
                      </button>
                      
                      <div className="flex-1">
                        <h3 className={cn(
                          "text-lg font-bold text-slate-800 transition-all duration-500",
                          task.completed && "line-through text-slate-400"
                        )}>
                          {task.text || task.title}
                        </h3>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                            <Clock size={12} /> {task.difficulty || 'Medium'}
                          </span>
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                            <Calendar size={12} /> {task.createdAt ? new Date(task.createdAt?.seconds * 1000).toLocaleDateString() : 'Today'}
                          </span>
                        </div>
                      </div>

                      <button 
                        onClick={() => deleteTask(task.id)}
                        className="opacity-0 group-hover:opacity-100 p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                      >
                        <Trash2 size={20} />
                      </button>
                    </GlassCard>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-24 bg-slate-50 rounded-[40px] border-4 border-dashed border-slate-100">
                  <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                    <Award className="text-slate-200" size={40} />
                  </div>
                  <p className="text-slate-400 font-bold text-lg">No tasks yet. Start by solving a problem!</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="space-y-12">
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
              <TrendingUp className="text-accent" size={20} />
            </div>
            Insights
          </h2>
          
          <GlassCard className="p-8 border-slate-100 shadow-2xl">
            <h3 className="font-black text-slate-900 mb-8 uppercase tracking-widest text-[11px]">Weekly Activity</h3>
            <div className="h-40 flex items-end gap-3">
              {[40, 70, 45, 90, 65, 30, 50].map((h, i) => (
                <div key={i} className="flex-1 bg-slate-50 rounded-2xl relative group overflow-hidden h-full">
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ delay: i * 0.1, duration: 1, ease: "easeOut" }}
                    className="absolute bottom-0 left-0 right-0 bg-accent/10 group-hover:bg-accent/30 transition-colors"
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              <span>Mon</span>
              <span>Sun</span>
            </div>
          </GlassCard>

          <GlassCard className="p-10 bg-slate-900 text-white border-none shadow-2xl shadow-slate-200 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-accent/20 transition-colors" />
            <h3 className="font-black mb-4 text-xl tracking-tight">Pro Strategist Tip</h3>
            <p className="text-slate-400 leading-relaxed font-medium">
              Break your "Daily Actions" into 25-minute focus blocks. It increases completion rates by 40%.
            </p>
            <div className="mt-8 flex items-center gap-2 text-accent font-black text-[10px] uppercase tracking-widest">
              Learn More <ArrowRight size={14} />
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
