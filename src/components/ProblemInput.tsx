import { useState } from "react";
import { Sparkles, Command, Cpu } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

interface ProblemInputProps {
  onSubmit: (text: string) => void;
  isLoading?: boolean;
  className?: string;
}

export function ProblemInput({ onSubmit, isLoading, className }: ProblemInputProps) {
  const [text, setText] = useState("");

  const suggestions = [
    "Scale engineering team to 100+ devs",
    "Launch SaaS in competitive market",
    "Transition to AI-first architecture",
    "Optimize global logistics network"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && !isLoading) {
      onSubmit(text);
    }
  };

  return (
    <div className={cn("w-full max-w-4xl mx-auto", className)}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative bg-white/[0.03] backdrop-blur-3xl p-1.5 rounded-[40px] border border-white/10 group transition-all hover:border-accent/30 shadow-2xl">
          <div className="absolute top-8 left-8 text-accent opacity-20 group-hover:opacity-100 transition-opacity">
            <Cpu size={24} className={cn(isLoading && "animate-spin")} />
          </div>
          
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Describe your critical challenge... Strategic depth is recommended."
            className="w-full h-40 pl-20 pr-8 pt-8 pb-24 rounded-[32px] bg-transparent text-white placeholder:text-white/20 focus:outline-none resize-none text-xl font-black tracking-tight leading-relaxed transition-all italic"
            disabled={isLoading}
          />

          <div className="absolute bottom-6 left-8 right-8 flex items-center justify-between">
            <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-white/20">
              <div className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/5 rounded-full">
                <Command size={12} /> SHIFT
              </div>
              <span className="hidden sm:inline">SYNAPSE MODE ACTIVE</span>
            </div>

            <button
              type="submit"
              disabled={!text.trim() || isLoading}
              className={cn(
                "group/btn relative overflow-hidden px-8 py-4 rounded-[20px] font-black text-[10px] uppercase tracking-[0.4em] transition-all duration-700 disabled:opacity-50 disabled:cursor-not-allowed",
                text.trim() ? "translate-y-0" : "translate-y-2 opacity-0"
              )}
            >
              <div className="absolute inset-0 bg-white transition-all duration-700 group-hover/btn:bg-accent" />
              <span className="relative z-10 flex items-center gap-4 text-background group-hover:text-white transition-colors uppercase italic font-black">
                {isLoading ? "Synthesizing" : "Architect Solution"}
                <Sparkles size={14} className={cn(isLoading && "animate-pulse")} />
              </span>
            </button>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3 px-4">
           {suggestions.map((s) => (
             <button
               key={s}
               type="button"
               onClick={() => setText(s)}
               className="text-[9px] font-black uppercase tracking-widest px-5 py-2.5 bg-white/5 border border-white/5 rounded-full text-white/30 hover:border-accent hover:text-accent transition-all hover:bg-white/10 italic"
             >
               {s}
             </button>
           ))}
        </div>
      </form>
    </div>
  );
}
