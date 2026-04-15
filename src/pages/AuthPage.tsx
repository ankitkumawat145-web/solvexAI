import { signInWithGoogle } from "@/firebase";
import { GlassCard } from "@/components/GlassCard";
import { BrainCircuit } from "lucide-react";
import { motion } from "motion/react";

export function AuthPage() {
  return (
    <div className="min-h-[calc(100vh-120px)] flex items-center justify-center px-6 bg-slate-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        <GlassCard className="text-center p-12 border-slate-200 shadow-2xl">
          <div className="w-16 h-16 bg-accent/10 rounded-[24px] flex items-center justify-center mx-auto mb-8 border border-accent/20 rotate-12">
            <BrainCircuit className="text-accent -rotate-12" size={32} />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">Welcome to SolveX AI</h1>
          <p className="text-slate-500 mb-10 font-medium">Sign in to start turning your problems into actionable plans.</p>
          
          <button 
            onClick={signInWithGoogle}
            className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all flex items-center justify-center gap-3 shadow-lg"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" referrerPolicy="no-referrer" />
            Continue with Google
          </button>
          
          <p className="mt-8 text-[10px] uppercase font-bold tracking-widest text-slate-400">
            Secure Authentication by Firebase
          </p>
        </GlassCard>
      </motion.div>
    </div>
  );
}
