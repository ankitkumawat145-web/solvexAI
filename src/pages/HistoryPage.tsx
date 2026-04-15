import { useState, useEffect } from "react";
import { db, auth } from "@/firebase";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { GlassCard } from "@/components/GlassCard";
import { History, ArrowRight, Calendar, Tag } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";

export function HistoryPage() {
  const [problems, setProblems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, "problems"),
      where("userId", "==", auth.currentUser.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProblems(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 md:px-12 py-12 bg-white">
      <div className="flex items-center gap-4 mb-12">
        <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center border border-accent/20">
          <History className="text-accent" size={24} />
        </div>
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-1">Problem History</h1>
          <p className="text-slate-500 font-medium">Review your past challenges and strategies.</p>
        </div>
      </div>

      <div className="grid gap-6">
        {problems.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
            <p className="text-slate-400 font-medium">No history found. Start by solving your first problem!</p>
          </div>
        ) : (
          problems.map((p, index) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <GlassCard hover className="group p-8 border-slate-200">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      <Calendar size={12} />
                      {p.createdAt?.toDate().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </div>
                    
                    <h3 className="text-2xl font-bold text-slate-900 leading-tight group-hover:text-accent transition-colors">
                      {p.problemText}
                    </h3>
                    
                    <div className="flex flex-wrap gap-2">
                      {p.categories?.map((cat: string) => (
                        <span key={cat} className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 border border-slate-200 rounded-full text-[10px] font-bold uppercase tracking-wider text-slate-500">
                          <Tag size={10} />
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <Link 
                    to="/solve" 
                    state={{ problem: p.problemText }}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-accent transition-all shadow-lg hover:shadow-accent/20"
                  >
                    Re-analyze <ArrowRight size={18} />
                  </Link>
                </div>
              </GlassCard>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
