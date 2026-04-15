import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function GlassCard({ children, className, hover = false }: GlassCardProps) {
  return (
    <div className={cn(
      "glass-card p-6",
      hover && "hover:border-accent/30 hover:shadow-xl hover:shadow-accent/5",
      className
    )}>
      {children}
    </div>
  );
}
