import { Link } from "react-router-dom";
import { motion } from "motion/react";

export function Navbar() {
  return (
    <nav className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] w-[95%] max-w-7xl">
      <div className="bg-background/80 backdrop-blur-3xl border border-white/5 rounded-[32px] px-10 h-[80px] flex items-center justify-between shadow-2xl overflow-hidden relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-transparent to-accent-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
        
        <Link to="/" className="flex items-center gap-5 text-2xl font-black tracking-tighter text-white relative z-10 group/logo">
          <motion.div 
            whileHover={{ rotate: 90 }}
            className="w-6 h-6 bg-accent rounded-md rotate-12 flex items-center justify-center shadow-[0_0_20px_#6366f144]"
          >
            <div className="w-2 h-2 bg-white rounded-full" />
          </motion.div>
          <span className="tracking-[-0.05em] uppercase italic">FLOWSYNTH</span>
        </Link>
        
        <div className="flex items-center gap-14 relative z-10">
          <div className="hidden md:flex items-center gap-12">
            <NavLink to="/dashboard">Terminal</NavLink>
            <NavLink to="/history">Vault</NavLink>
            <NavLink to="/flow">Neural Flow</NavLink>
          </div>

          <div className="h-6 w-px bg-white/10" />

          <Link to="/solve" className="relative group/auth overflow-hidden bg-white text-background px-10 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] transition-all hover:scale-105 active:scale-95 shadow-xl hover:shadow-accent/40">
             <span className="relative z-10 italic">Initialize Flow</span>
             <div className="absolute inset-0 bg-accent translate-y-full group-hover/auth:translate-y-0 transition-transform duration-500" />
          </Link>
        </div>
      </div>
    </nav>
  );
}

function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link 
      to={to} 
      className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 hover:text-white transition-all relative group flex items-center gap-3 italic"
    >
      <div className="w-1.5 h-1.5 rounded-full bg-accent opacity-0 group-hover:opacity-100 transition-all scale-0 group-hover:scale-100" />
      {children}
    </Link>
  );
}
