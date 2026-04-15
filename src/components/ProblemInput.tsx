import { useState } from "react";
import { Send, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProblemInputProps {
  onSubmit: (text: string) => void;
  isLoading?: boolean;
  className?: string;
}

export function ProblemInput({ onSubmit, isLoading, className }: ProblemInputProps) {
  const [text, setText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && !isLoading) {
      onSubmit(text);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn("relative group", className)}>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Explain your current challenge in detail... e.g. 'I want to transition from marketing to software engineering in 6 months with zero budget.'"
        className="w-full h-[160px] p-6 rounded-[32px] border-2 border-slate-100 bg-white text-slate-900 placeholder:text-slate-400 focus:border-accent/40 focus:ring-4 focus:ring-accent/5 transition-all outline-none resize-none text-lg font-medium shadow-sm group-hover:shadow-md"
        disabled={isLoading}
      />
      <div className="absolute bottom-4 right-4 flex items-center gap-3">
        <button
          type="submit"
          disabled={!text.trim() || isLoading}
          className={cn(
            "px-8 py-4 rounded-2xl font-bold text-sm transition-all duration-300 flex items-center gap-2",
            text.trim() && !isLoading 
              ? "bg-slate-900 text-white hover:bg-accent hover:scale-[1.05] shadow-xl shadow-slate-200" 
              : "bg-slate-100 text-slate-400 cursor-not-allowed"
          )}
        >
          {isLoading ? (
            <>
              <Sparkles className="animate-spin" size={18} />
              Strategizing...
            </>
          ) : (
            <>
              Analyze & Solve
              <Send size={16} />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
