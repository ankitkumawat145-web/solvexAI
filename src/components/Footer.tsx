import { Link } from "react-router-dom";
import { Instagram, Twitter, Linkedin, Github, Mail, Globe, Cpu, ShieldCheck } from "lucide-react";
import { motion } from "motion/react";

export function Footer() {
  return (
    <footer className="bg-background text-foreground pt-40 pb-20 overflow-hidden relative border-t border-white/5">
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-8 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 mb-40">
          <div className="space-y-12">
            <Link to="/" className="flex items-center gap-5 text-3xl font-black tracking-tighter text-white font-sans italic">
              <div className="w-8 h-8 bg-accent rounded-xl rotate-12 flex items-center justify-center shadow-2xl shadow-accent/20">
                <div className="w-3 h-3 bg-white rounded-full" />
              </div>
              <span className="uppercase">FLOWSYNTH</span>
            </Link>
            <p className="text-xl text-white/40 max-w-md font-black uppercase tracking-tight leading-tight opacity-80 italic">
              Elite Strategic Neuro-Architect. We deconstruct chaos into high-fidelity tactical roadmap systems with 128-bit clarity.
            </p>
            <div className="flex items-center gap-6">
              <SocialLink href="#" icon={<Twitter size={20} />} />
              <SocialLink href="#" icon={<Linkedin size={20} />} />
              <SocialLink href="#" icon={<Github size={20} />} />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-16">
            <FooterColumn title="Protocols" links={[
              { label: "Synthesis", href: "/" },
              { label: "Terminal", href: "/dashboard" },
              { label: "Vault", href: "/history" },
              { label: "Neural Flow", href: "/flow" }
            ]} />
            <FooterColumn title="Architecture" links={[
              { label: "Deconstruction", href: "#" },
              { label: "Synaptic Map", href: "#" },
              { label: "Tactical Logic", href: "#" },
              { label: "Matrix Sync", href: "#" }
            ]} />
            <FooterColumn title="System" links={[
              { label: "Security", href: "#" },
              { label: "Privacy", href: "#" },
              { label: "Terms", href: "#" },
              { label: "Latency", href: "#" }
            ]} />
          </div>
        </div>

        <div className="border-t border-white/5 pt-20 flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex items-center gap-10">
            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-white/20">
              <ShieldCheck size={14} className="text-emerald-500" /> AES-256 Encrypted
            </div>
            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-white/20">
              <Cpu size={14} className="text-accent" /> Neural Core v4.9
            </div>
          </div>
          <div className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 text-center md:text-right italic">
            © 2024 FLOW SYNTHESIS SYSTEMS // CLARITY BY DESIGN
          </div>
        </div>

        {/* Massive Background Text */}
        <div className="absolute bottom-[-140px] left-0 right-0 pointer-events-none select-none opacity-[0.01] text-[30vw] font-black tracking-tighter text-white whitespace-nowrap text-center italic">
          STRATEGIC
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: any) {
  return (
    <div className="space-y-8">
      <h4 className="text-accent font-black uppercase text-[10px] tracking-[0.4em] italic">{title} //</h4>
      <ul className="space-y-5">
        {links.map((link: any) => (
          <li key={link.label}>
            <Link to={link.href} className="text-white/40 hover:text-white font-black uppercase text-[11px] tracking-widest transition-all italic flex items-center gap-3 group">
              <div className="w-1 h-1 bg-accent rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialLink({ href, icon }: { href: string; icon: React.ReactNode }) {
  return (
    <motion.a 
      whileHover={{ y: -5, scale: 1.1 }}
      href={href} 
      className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-accent transition-all shadow-xl shadow-black/20"
    >
      {icon}
    </motion.a>
  );
}
