import { useEffect, useRef } from "react";
import mermaid from "mermaid";

mermaid.initialize({
  startOnLoad: true,
  theme: "neutral",
  securityLevel: "loose",
  fontFamily: "Inter",
  themeVariables: {
    primaryColor: "#6366F1",
    primaryTextColor: "#1A1A1A",
    primaryBorderColor: "#E5E7EB",
    lineColor: "#6366F1",
    secondaryColor: "#F3F4F6",
    tertiaryColor: "#FFFFFF",
  }
});

export function Mermaid({ chart }: { chart: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current && chart) {
      ref.current.removeAttribute("data-processed");
      mermaid.contentLoaded();
    }
  }, [chart]);

  return (
    <div className="mermaid flex justify-center bg-slate-50 p-10 rounded-[32px] border border-slate-100 overflow-auto shadow-inner" ref={ref}>
      {chart}
    </div>
  );
}
