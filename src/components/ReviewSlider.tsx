import { motion } from "motion/react";

const REVIEWS_1 = [
  { name: "Sarah Chen", role: "CEO @ Velo", text: "SolveX turned my 6-month growth plan into 30 days of absolute tactical clarity." },
  { name: "Marcus Thorne", role: "Venture Partner", text: "The strategy roots are mathematically perfect. It's like having a BCG partner in my pocket." },
  { name: "Elena Rossi", role: "Design Lead", text: "Finally, an AI that understands the non-vague steps required for real creative execution." },
  { name: "Jameson Blake", role: "Solo Founder", text: "Transitioning to SoloX was the single best decision for my startup speed." },
];

const REVIEWS_2 = [
  { name: "Dr. Aris Varma", role: "Strategic Researcher", text: "The cognitive delegation in this platform is unprecedented. Simply brilliant work." },
  { name: "Maya Patel", role: "Product Director", text: "I've tried every roadmap tool. SolveX is the only one that actually works." },
  { name: "David Kim", role: "Performance Coach", text: "The hierarchical branching is exactly how the human brain wants to deconstruct complexity." },
  { name: "Sophie Laurent", role: "Ops Manager", text: "Total game changer for our operations. Clarity is now our competitive advantage." },
];

export function ReviewSlider() {
  return (
    <section className="py-40 bg-slate-50 overflow-hidden border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-6 md:px-12 mb-20">
        <div className="tagline !text-slate-400">Archived Feedback</div>
        <h2 className="text-slate-950 font-black text-4xl tracking-tighter">Strategic Validation.</h2>
      </div>

      <div className="flex flex-col gap-6">
        {/* Row 1: Left to Right */}
        <div className="relative flex select-none overflow-hidden">
          <motion.div 
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            className="flex flex-nowrap shrink-0 gap-6 min-w-full py-4"
          >
            {[...REVIEWS_1, ...REVIEWS_1].map((review, i) => (
              <ReviewCard key={i} {...review} />
            ))}
          </motion.div>
        </div>

        {/* Row 2: Right to Left */}
        <div className="relative flex select-none overflow-hidden">
          <motion.div 
            animate={{ x: ["-50%", "0%"] }}
            transition={{ duration: 65, repeat: Infinity, ease: "linear" }}
            className="flex flex-nowrap shrink-0 gap-6 min-w-full py-4"
          >
            {[...REVIEWS_2, ...REVIEWS_2].map((review, i) => (
              <ReviewCard key={i} {...review} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function ReviewCard({ name, role, text }: { name: string; role: string; text: string }) {
  return (
    <div className="w-[380px] shrink-0 p-8 bg-white border border-slate-100 rounded-[32px] group transition-all shadow-sm hover:shadow-md">
      <div className="flex flex-col justify-between h-full">
        <p className="text-sm font-bold text-slate-600 italic leading-relaxed mb-6">
          "{text}"
        </p>
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center font-black text-[10px] text-accent">
            {name.charAt(0)}
          </div>
          <div>
            <div className="font-black text-slate-900 text-[10px] tracking-tight">{name}</div>
            <div className="text-[9px] font-bold uppercase tracking-widest text-slate-400">{role}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
