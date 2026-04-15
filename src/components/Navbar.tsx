import { Link, useNavigate } from "react-router-dom";
import { auth, logOut } from "@/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { LogOut, User, BrainCircuit } from "lucide-react";

export function Navbar() {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-xl border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6 md:px-12 h-[80px] flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 text-[22px] font-black tracking-tighter text-slate-900">
          <div className="w-4 h-4 bg-accent rounded-[4px] rotate-12 flex items-center justify-center shadow-lg shadow-accent/20">
            <div className="w-1.5 h-1.5 bg-white rounded-full" />
          </div>
          <span>SOLVEX AI</span>
        </Link>
        
        <div className="flex items-center gap-10">
          {user ? (
            <>
              <div className="hidden md:flex items-center gap-8">
                <Link to="/dashboard" className="text-[13px] font-bold uppercase tracking-widest text-slate-500 hover:text-accent transition-colors">Dashboard</Link>
                <Link to="/history" className="text-[13px] font-bold uppercase tracking-widest text-slate-500 hover:text-accent transition-colors">History</Link>
              </div>
              <div className="flex items-center gap-4 pl-8 border-l border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 group cursor-pointer hover:border-accent/30 transition-all">
                    <User size={18} className="text-slate-400 group-hover:text-accent transition-colors" />
                  </div>
                  <div className="hidden lg:block">
                    <div className="text-[11px] font-bold uppercase tracking-widest text-slate-400 leading-none mb-1">Account</div>
                    <div className="text-sm font-bold text-slate-900 leading-none">{user.displayName?.split(' ')[0] || 'User'}</div>
                  </div>
                </div>
                <button 
                  onClick={() => { logOut(); navigate("/"); }}
                  className="w-10 h-10 flex items-center justify-center hover:bg-red-50 rounded-2xl transition-all text-slate-400 hover:text-red-500"
                  title="Log Out"
                >
                  <LogOut size={18} />
                </button>
              </div>
            </>
          ) : (
            <Link to="/auth" className="bg-slate-900 text-white px-8 py-3.5 rounded-2xl text-sm font-bold hover:bg-accent transition-all shadow-xl shadow-slate-200 hover:shadow-accent/20">Get Started</Link>
          )}
        </div>
      </div>
    </nav>
  );
}
