import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useMotionValue, useTransform } from "motion/react";
import { 
  TransformWrapper, 
  TransformComponent, 
  useTransformEffect 
} from "react-zoom-pan-pinch";
import { 
  Plus, 
  Trash2, 
  ChevronRight, 
  Zap, 
  Compass, 
  Layers, 
  Shield, 
  Activity, 
  CheckCircle2, 
  Box, 
  Cpu, 
  Maximize2, 
  Minimize2, 
  MousePointer2, 
  Layout, 
  Share2,
  X,
  PlusCircle,
  Link as LinkIcon,
  ArrowLeft,
  Wand2,
  Share,
  BrainCircuit,
  Sparkles
} from "lucide-react";
import { generateJourneyNodes } from "@/services/aiService";
import { cn } from "@/lib/utils";

// --- Types ---
interface NodePosition {
  x: number;
  y: number;
}

interface JourneyNode {
  id: string;
  parentId: string | null;
  title: string;
  description: string;
  icon: string;
  position: NodePosition;
  progress: number;
  subSteps: string[];
  color: string;
}

// --- Icons Map ---
const ICONS: Record<string, any> = {
  Zap, Compass, Layers, Shield, Activity, CheckCircle2, Box, Cpu
};

const COLORS = [
  "#6366f1", // Indigo
  "#ec4899", // Pink
  "#f59e0b", // Amber
  "#10b981", // Emerald
  "#3b82f6", // Blue
  "#8b5cf6", // Purple
];

// --- Mock Initial Data ---
const INITIAL_NODES: JourneyNode[] = [
  {
    id: "root",
    parentId: null,
    title: "Project Alpha: Market Entry",
    description: "The primary strategic objective for Q3 expansion into the digital collectibles space.",
    icon: "Compass",
    position: { x: 500, y: 500 },
    progress: 30,
    subSteps: ["Audit current assets", "Define target persona", "Legal compliance check"],
    color: "#6366f1"
  }
];

export function JourneyBuilder() {
  const navigate = useNavigate();
  const [nodes, setNodes] = useState<JourneyNode[]>(INITIAL_NODES);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Selected node derived state
  const selectedNode = useMemo(() => 
    nodes.find(n => n.id === selectedNodeId) || null, 
    [nodes, selectedNodeId]
  );

  // --- Handlers ---
  const addNode = useCallback((parentId: string) => {
    const parent = nodes.find(n => n.id === parentId);
    if (!parent) return;

    // Calculate initial position relative to parent
    const children = nodes.filter(n => n.parentId === parentId);
    const offset = (children.length - 1) * 150;

    const newNode: JourneyNode = {
      id: `node-${Date.now()}`,
      parentId,
      title: "New Strategic Step",
      description: "Define the specific outcome and tactical requirements for this phase.",
      icon: "Layers",
      position: { 
        x: parent.position.x + 350, 
        y: parent.position.y + offset + (Math.random() * 50 - 25) 
      },
      progress: 0,
      subSteps: [],
      color: COLORS[nodes.length % COLORS.length]
    };

    setNodes(prev => [...prev, newNode]);
    setSelectedNodeId(newNode.id);
    setIsPanelOpen(true);
  }, [nodes]);

  const updateNode = useCallback((id: string, updates: Partial<JourneyNode>) => {
    setNodes(prev => prev.map(n => n.id === id ? { ...n, ...updates } : n));
  }, []);

  const deleteNode = useCallback((id: string) => {
    if (id === "root") return; // Prevent root deletion
    setNodes(prev => {
      const toDelete = new Set([id]);
      const findChildren = (pid: string) => {
        prev.forEach(n => {
          if (n.parentId === pid) {
            toDelete.add(n.id);
            findChildren(n.id);
          }
        });
      };
      findChildren(id);
      return prev.filter(n => !toDelete.has(n.id));
    });
    setSelectedNodeId(null);
    setIsPanelOpen(false);
  }, []);

  const handleNodeDrag = (id: string, info: any) => {
    // Note: info.point is absolute, we might need relative delta or update via state
    // For simplicity in this mock, we'll assume the interaction is handled well
  };

  const [isAIExpanding, setIsAIExpanding] = useState(false);

  const handleAIExpand = async (id: string) => {
    const targetNode = nodes.find(n => n.id === id);
    if (!targetNode || isAIExpanding) return;

    setIsAIExpanding(true);
    try {
      const suggestions = await generateJourneyNodes(
        nodes.find(n => n.id === targetNode.parentId)?.title || "Global Project",
        targetNode.title
      );

      const newNodes = suggestions.map((s: any, i: number) => ({
        id: `ai-${Date.now()}-${i}`,
        parentId: id,
        title: s.title,
        description: s.description,
        icon: s.icon,
        position: { 
          x: targetNode.position.x + 400, 
          y: targetNode.position.y + (i - Math.floor(suggestions.length / 2)) * 220 
        },
        progress: 0,
        subSteps: s.subSteps,
        color: COLORS[(nodes.length + i) % COLORS.length]
      }));

      setNodes(prev => [...prev, ...newNodes]);
    } catch (error) {
      console.error("AI Expansion failed:", error);
    } finally {
      setIsAIExpanding(false);
    }
  };

  const autoLayout = useCallback(() => {
    setNodes(currentNodes => {
      const newNodes = [...currentNodes];
      const spacingX = 400;
      const spacingY = 200;

      const layoutBranch = (parentId: string | null, depth: number, startY: number) => {
        const children = newNodes.filter(n => n.parentId === parentId);
        const totalHeight = (children.length - 1) * spacingY;
        let currentY = startY - totalHeight / 2;

        children.forEach(child => {
          child.position = {
            x: 500 + depth * spacingX,
            y: currentY
          };
          layoutBranch(child.id, depth + 1, currentY);
          currentY += spacingY;
        });
      };

      layoutBranch(null, 0, 500);
      return newNodes;
    });
  }, []);

  const onNodeClick = (id: string) => {
    setSelectedNodeId(id);
    setIsPanelOpen(true);
  };

  // --- Connection Lines Calculation ---
  const connections = useMemo(() => {
    return nodes
      .filter(n => n.parentId !== null)
      .map(n => ({
        id: `conn-${n.parentId}-${n.id}`,
        from: n.parentId!,
        to: n.id
      }));
  }, [nodes]);

  return (
    <div className="flex h-screen w-full bg-[#050505] overflow-hidden text-slate-200 font-sans selection:bg-accent/30">
      {/* --- High End Background Architecture --- */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 opacity-[0.03]" 
          style={{ backgroundImage: 'radial-gradient(#6366f1 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_-20%,_#4f46e510,_transparent),_radial-gradient(circle_at_80%_80%,_#7c3aed10,_transparent)]" />
        
        {/* Neon Grid Overlay */}
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none"
             style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(0deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '120px 120px' }} />
      </div>

      {/* LEFT SIDE: Main Canvas (70%) */}
      <div className="relative flex-1 h-full z-10 border-r border-white/5 overflow-hidden">
        {/* Top Floating Mini-Nav */}
        <div className="absolute top-8 left-8 z-50 flex items-center gap-4">
          <button 
            onClick={() => navigate("/")}
            className="p-4 bg-slate-900/80 backdrop-blur-3xl border border-white/10 rounded-[20px] text-slate-400 hover:text-white transition-all shadow-2xl group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          </button>
          
          <div className="bg-slate-900/60 backdrop-blur-3xl border border-white/10 px-8 py-4 rounded-[24px] flex items-center gap-8 shadow-2xl border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-accent rounded-full animate-pulse shadow-[0_0_15px_#6366f1]" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Neural Flow Architect</span>
            </div>
            <div className="h-4 w-px bg-white/10" />
            <div className="flex gap-6">
              <button 
                onClick={autoLayout}
                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-accent transition-colors"
                title="Optimize Layout"
              >
                <Wand2 size={16} />
                Optimize Graph
              </button>
              <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors">
                <Share size={16} />
                Export Map
              </button>
            </div>
          </div>
        </div>

        <TransformWrapper
          initialPositionX={-1200}
          initialPositionY={-1500}
          initialScale={0.7}
          minScale={0.1}
          maxScale={2}
          limitToBounds={false}
          centerOnInit={true}
        >
          {({ zoomIn, zoomOut, resetTransform }) => (
            <>
              {/* Controls UI */}
              <div className="absolute bottom-8 left-8 z-50 flex flex-col gap-3">
                <div className="bg-slate-900/80 backdrop-blur-3xl border border-white/10 p-2.5 rounded-[22px] flex flex-col gap-2 shadow-2xl">
                  <button onClick={() => zoomIn()} className="p-3.5 bg-white/5 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white transition-all border border-white/5">
                    <Maximize2 size={18} />
                  </button>
                  <button onClick={() => zoomOut()} className="p-3.5 bg-white/5 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white transition-all border border-white/5">
                    <Minimize2 size={18} />
                  </button>
                  <button onClick={() => resetTransform()} className="p-3.5 bg-white/5 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white transition-all border border-white/5">
                    <Activity size={18} />
                  </button>
                </div>
              </div>

              <TransformComponent
                wrapperStyle={{ width: "100%", height: "100%", cursor: "grab" }}
                contentStyle={{ width: "10000px", height: "10000px", background: "transparent" }}
              >
                <div 
                  className="relative w-full h-full" 
                  onClick={(e) => {
                    if (e.target === e.currentTarget) {
                      setSelectedNodeId(null);
                      setIsPanelOpen(false);
                    }
                  }}
                >
                  
                  {/* --- SVG Connection Root System (Horizontal Optimized) --- */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-10">
                    <defs>
                      <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="12" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                      </filter>
                      <linearGradient id="activeFlow" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="transparent" />
                        <stop offset="50%" stopColor="#6366f1" />
                        <stop offset="100%" stopColor="transparent" />
                        <animate attributeName="x1" from="-100%" to="100%" dur="3s" repeatCount="indefinite" />
                        <animate attributeName="x2" from="0%" to="200%" dur="3s" repeatCount="indefinite" />
                      </linearGradient>
                    </defs>

                    {connections.map(conn => {
                      const fromNode = nodes.find(n => n.id === conn.from);
                      const toNode = nodes.find(n => n.id === conn.to);
                      if (!fromNode || !toNode) return null;

                      // Horizontal Anchors: Right side of parent, Left side of child
                      const nodeWidth = 340;
                      const nodeHeight = 160;
                      const sx = fromNode.position.x + nodeWidth; 
                      const sy = fromNode.position.y + nodeHeight / 2;
                      const ex = toNode.position.x;
                      const ey = toNode.position.y + nodeHeight / 2;
                      
                      // Horizontal Bezier: x-control points moved out
                      const dx = ex - sx;
                      const cp1x = sx + dx * 0.4;
                      const cp2x = sx + dx * 0.6;
                      const path = `M ${sx} ${sy} C ${cp1x} ${sy}, ${cp2x} ${ey}, ${ex} ${ey}`;

                      const isActive = selectedNodeId === fromNode.id || selectedNodeId === toNode.id;
                      const isContextual = selectedNodeId ? isActive : true;

                      return (
                        <g key={conn.id}>
                          {/* Background Static Line */}
                          <motion.path
                            d={path}
                            stroke={isActive ? "#6366f1" : "rgba(99,102,241,0.08)"}
                            strokeWidth={isActive ? 3.5 : 2}
                            fill="none"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ 
                              pathLength: 1, 
                              opacity: isContextual ? 1 : 0.05,
                              stroke: isActive ? "#6366f1" : "rgba(255,255,255,0.08)"
                            }}
                            transition={{ duration: 1.5, ease: "easeInOut" }}
                          />
                          {/* Active Flow Pulse */}
                          {isActive && (
                            <motion.path
                              d={path}
                              stroke="url(#activeFlow)"
                              strokeWidth={5}
                              fill="none"
                              filter="url(#neonGlow)"
                            />
                          )}
                        </g>
                      );
                    })}
                  </svg>

                  {/* Nodes Layer */}
                  <div className="relative w-full h-full pointer-events-none">
                    <AnimatePresence>
                      {nodes.map(node => (
                        <JourneyNodeComponent
                          key={node.id}
                          node={node}
                          isSelected={selectedNodeId === node.id}
                          onClick={() => onNodeClick(node.id)}
                          onDrag={(e: any, info: any) => {
                             const newPos = { 
                               x: node.position.x + info.delta.x, 
                               y: node.position.y + info.delta.y 
                             };
                             updateNode(node.id, { position: newPos });
                          }}
                          onHoverStart={() => setHoveredNodeId(node.id)}
                          onHoverEnd={() => setHoveredNodeId(null)}
                          onAddChild={() => addNode(node.id)}
                          isBlurred={!!selectedNodeId && selectedNodeId !== node.id}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              </TransformComponent>
            </>
          )}
        </TransformWrapper>
      </div>

      {/* RIGHT SIDE PANEL: Details (30%) */}
      <AnimatePresence>
        {isPanelOpen && selectedNode && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="w-[480px] h-full bg-[#0d0f14]/90 backdrop-blur-3xl border-l border-white/5 z-50 flex flex-col shadow-[-50px_0_100px_rgba(0,0,0,0.9)]"
          >
            {/* Header */}
            <div className="p-12 pb-8 flex items-center justify-between border-b border-white/5">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-[24px] bg-accent/20 border border-accent/40 flex items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.2)]">
                  <DynamicIcon name={selectedNode.icon} className="text-accent" size={32} />
                </div>
                <div className="flex-1">
                  <h3 className="text-[11px] font-black uppercase tracking-[0.6em] text-slate-500 mb-2">Tactical Node</h3>
                  <input 
                    type="text" 
                    value={selectedNode.title}
                    onChange={(e) => updateNode(selectedNode.id, { title: e.target.value })}
                    className="bg-transparent text-2xl font-black text-white focus:outline-none w-full tracking-tighter"
                  />
                </div>
              </div>
              <button 
                onClick={() => setIsPanelOpen(false)}
                className="p-4 hover:bg-white/5 rounded-full text-slate-500 hover:text-white transition-all border border-white/5"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-12 py-10 space-y-12 custom-scrollbar">
              {/* AI Explanation / Context */}
              <section className="space-y-6">
                <div className="flex items-center gap-3">
                   <BrainCircuit className="text-accent" size={18} />
                   <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400">AI Deep Synthesis</h4>
                </div>
                <div className="relative">
                   <div className="absolute -inset-1 bg-gradient-to-r from-accent/20 to-purple-500/20 rounded-[30px] blur-sm opacity-50" />
                   <textarea 
                    value={selectedNode.description}
                    onChange={(e) => updateNode(selectedNode.id, { description: e.target.value })}
                    className="relative w-full bg-[#080a0e] border border-white/10 rounded-[30px] p-8 text-base text-slate-300 min-h-[220px] focus:outline-none focus:border-accent/40 transition-all leading-relaxed font-medium"
                    placeholder="Synthesis engine ready for input..."
                  />
                </div>
              </section>

              {/* Progress Bar Detail */}
              <section className="space-y-10">
                <div className="flex justify-between items-end">
                  <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400">Execution Depth</h4>
                  <span className="text-3xl font-black text-accent">{selectedNode.progress}%</span>
                </div>
                <div className="relative pt-6">
                   <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={selectedNode.progress}
                    onChange={(e) => updateNode(selectedNode.id, { progress: parseInt(e.target.value) })}
                    className="w-full accent-accent h-2 cursor-pointer absolute top-0 z-20 opacity-0"
                  />
                  <div className="h-2 w-full bg-white/5 rounded-full relative overflow-hidden">
                     <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${selectedNode.progress}%` }}
                        className="absolute inset-y-0 left-0 bg-accent shadow-[0_0_15px_#6366f1]" 
                     />
                  </div>
                  <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mt-6">
                    <span>Initiated</span>
                    <span>Optimized</span>
                    <span>Finalized</span>
                  </div>
                </div>
              </section>

              {/* Steps List */}
              <section className="space-y-8">
                <div className="flex justify-between items-center">
                   <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400">Tactical Breakdown</h4>
                   <span className="text-[10px] font-black bg-white/5 px-4 py-2 rounded-full text-slate-500 border border-white/5">{selectedNode.subSteps.length} Steps</span>
                </div>
                <div className="space-y-4">
                  {selectedNode.subSteps.map((step, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="group flex items-center gap-6 p-6 bg-white/[0.02] border border-white/5 rounded-[24px] hover:border-accent/40 hover:bg-white/[0.04] transition-all"
                    >
                      <button className="w-7 h-7 rounded-full border-2 border-accent/40 flex items-center justify-center hover:bg-accent/20">
                        <CheckCircle2 size={16} className="text-accent" />
                      </button>
                      <input 
                        type="text" 
                        value={step}
                        onChange={(e) => {
                          const newSteps = [...selectedNode.subSteps];
                          newSteps[i] = e.target.value;
                          updateNode(selectedNode.id, { subSteps: newSteps });
                        }}
                        className="bg-transparent flex-1 text-sm font-bold text-slate-300 focus:outline-none"
                      />
                      <button 
                        onClick={() => {
                          const newSteps = selectedNode.subSteps.filter((_, index) => index !== i);
                          updateNode(selectedNode.id, { subSteps: newSteps });
                        }}
                        className="opacity-0 group-hover:opacity-100 p-2 text-slate-500 hover:text-red-500 transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </motion.div>
                  ))}
                  <button 
                    onClick={() => updateNode(selectedNode.id, { subSteps: [...selectedNode.subSteps, "New Strategic Step"] })}
                    className="w-full py-6 border border-dashed border-white/10 rounded-[28px] text-[10px] font-black uppercase tracking-[0.5em] text-slate-500 hover:text-accent hover:border-accent/40 transition-all flex items-center justify-center gap-4 group"
                  >
                    <Plus size={20} className="group-hover:rotate-90 transition-transform" />
                    Extend Tactical Node
                  </button>
                </div>
              </section>
            </div>

            {/* Footer Actions */}
            <div className="p-12 pt-8 border-t border-white/5 space-y-6">
              <button 
                onClick={() => handleAIExpand(selectedNode.id)}
                disabled={isAIExpanding}
                className="w-full py-7 bg-accent text-white rounded-[28px] font-black text-sm uppercase tracking-[0.6em] flex items-center justify-center gap-4 shadow-[0_20px_50px_rgba(99,102,241,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {isAIExpanding ? (
                  <BrainCircuit className="animate-spin" size={24} />
                ) : (
                  <Sparkles size={24} />
                )}
                {isAIExpanding ? "Processing..." : "Neural Synthesis"}
              </button>
              
              <div className="grid grid-cols-2 gap-5">
                <button 
                  onClick={() => addNode(selectedNode.id)}
                  className="py-6 bg-white/5 text-emerald-500 border border-emerald-500/20 rounded-[24px] font-black text-[11px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-emerald-500/10 transition-all"
                >
                  <PlusCircle size={20} /> Branch
                </button>
                <button 
                  onClick={() => deleteNode(selectedNode.id)}
                  className="py-6 bg-red-500/10 text-red-500 border border-red-500/20 rounded-[24px] font-black text-[11px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-red-500/20 transition-all"
                >
                  <Trash2 size={20} /> Terminate
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- Sub-Components ---

function JourneyNodeComponent({ node, isSelected, onClick, onDrag, onHoverStart, onHoverEnd, isBlurred, onAddChild }: any) {
  const nodeRef = useRef(null);

  return (
    <motion.div
      ref={nodeRef}
      drag
      dragMomentum={false}
      onPointerDown={(e) => e.stopPropagation()}
      onDrag={onDrag}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ 
        scale: isSelected ? 1.05 : 1, 
        opacity: 1,
        filter: isBlurred ? "blur(4px)" : "blur(0px)",
        x: node.position.x,
        y: node.position.y,
        transition: { type: "spring", stiffness: 300, damping: 25 }
      }}
      whileHover={{ scale: isSelected ? 1.05 : 1.1, zIndex: 100 }}
      onHoverStart={onHoverStart}
      onHoverEnd={onHoverEnd}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      className={cn(
        "absolute cursor-grab active:cursor-grabbing p-8 rounded-[40px] border transition-all duration-500 select-none pointer-events-auto",
        isSelected 
          ? "bg-[#0d0f14] border-accent shadow-[0_0_60px_rgba(99,102,241,0.4)] z-40" 
          : "bg-[#0d0f14]/60 backdrop-blur-2xl border-white/10 hover:border-accent/40 z-20 group shadow-2xl"
      )}
      style={{ width: "340px", height: "160px" }}
    >
      <div className="flex gap-7 h-full items-start">
        <div 
          className="w-20 h-20 rounded-[28px] overflow-hidden flex items-center justify-center shrink-0 shadow-2xl relative"
          style={{ backgroundColor: `${node.color}15`, border: `2px solid ${node.color}40`, color: node.color }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
          <DynamicIcon name={node.icon} size={36} className="relative z-10" />
        </div>
        
        <div className="flex-1 flex flex-col h-full justify-between pt-1">
          <div>
            <h4 className="text-base font-black text-white leading-tight mb-2 tracking-tight line-clamp-2">{node.title}</h4>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse shadow-[0_0_8px_#6366f1]" />
              <span className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-500">Logical Node</span>
            </div>
          </div>

          {/* Progress Bar in Node */}
          <div className="space-y-2.5 mt-auto">
            <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest">
              <span className="text-slate-500">Execution</span>
              <span style={{ color: node.color }}>{node.progress}%</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${node.progress}%` }}
                className="h-full transition-all duration-1000"
                style={{ 
                  backgroundColor: node.color,
                  boxShadow: `0 0 10px ${node.color}60` 
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Expansion Point (Horizontal Branching) */}
      <motion.button
        initial={{ opacity: 0, scale: 0.5, x: 20 }}
        whileHover={{ scale: 1.25 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        onClick={(e) => { e.stopPropagation(); onAddChild(); }}
        className="absolute -right-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-accent text-white rounded-[24px] flex items-center justify-center shadow-[0_15px_40px_rgba(99,102,241,0.5)] z-[100] group-hover:bg-indigo-500 transition-all border-4 border-[#050505]"
      >
        <Plus size={28} />
      </motion.button>

      {/* Node Glow Overlay */}
      <div className="absolute inset-0 rounded-[40px] bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
    </motion.div>
  );
}

function DynamicIcon({ name, ...props }: any) {
  const Icon = ICONS[name] || Box;
  return <Icon {...props} />;
}
