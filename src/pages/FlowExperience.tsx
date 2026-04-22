import { useState, useEffect, useRef, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import * as Icons from "lucide-react";
import { 
  ArrowLeft, LayoutDashboard, Sparkles, BrainCircuit, AlertCircle, Check, Plus, 
  Minus, Info, Command, Share2, MousePointer2, MoveHorizontal, Database, 
  Disc, Cpu, ShieldAlert, Binary, ChevronRight, X, Maximize2, ZoomIn, ZoomOut, Maximize,
  Trash2, Edit3, Link as LinkIcon, Activity, Layers, Zap, Target
} from "lucide-react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { analyzeProblem } from "@/services/aiService";
import { cn } from "@/lib/utils";
import { NeuralStorage } from "@/lib/storage";

// --- Types ---
interface FlowStep {
  id: string;
  parentId: string | null;
  title: string;
  description: string;
  icon: string;
  detailedExplanation: string;
  advancedInsights: string[];
}

interface FlowData {
  categories: string[];
  rootCause: string;
  steps: FlowStep[];
}

interface NodePosition {
  x: number;
  y: number;
  depth: number;
}

// --- Dynamic Icon Helper ---
const DynamicIcon = ({ name, size = 24, className }: { name: string; size?: number; className?: string }) => {
  const IconComponent = (Icons as any)[name] || Icons.Circle;
  return <IconComponent size={size} className={className} />;
};

export function FlowExperience() {
  const location = useLocation();
  const navigate = useNavigate();
  const [problemText] = useState(location.state?.problem || "");
  const [data, setData] = useState<FlowData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [localProblemId, setLocalProblemId] = useState<string | null>(null);
  
  // Interaction State
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [positionsState, setPositionsState] = useState<Record<string, NodePosition>>({});
  const [isDraggingNode, setIsDraggingNode] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");

  useEffect(() => {
    if (!problemText) {
      navigate("/");
      return;
    }
    
    const runAnalysis = async () => {
      setLoading(true);
      try {
        let existingProblem = NeuralStorage.getLatestProblem(problemText);

        let result;
        if (existingProblem) {
          result = existingProblem.data;
          setLocalProblemId(existingProblem.id);
        } else {
          result = await analyzeProblem(problemText);
          const saved = NeuralStorage.saveProblem(problemText, result);
          setLocalProblemId(saved.id);
        }
        
        setData(result);
        
        // --- AUTO LAYOUT ENGINE: HORIZONTAL TREE (LTR) ---
        const pos: Record<string, NodePosition> = {};
        const steps = result.steps;
        const X_SPACING = 400; 
        const Y_SPACING = 180;
        const CANVAS_LEFT_OFFSET = 500; 

        const getChildren = (pid: string | null) => 
          steps.filter((s: FlowStep) => {
            if (pid === null) return !s.parentId || s.parentId === "null";
            return s.parentId === pid;
          });

        const calculateRecursive = (pid: string | null, depth: number, startY: number) => {
          const children = getChildren(pid);
          if (children.length === 0) return;

          const totalHeight = (children.length - 1) * Y_SPACING;
          children.forEach((child, i) => {
            // Horizontal Flow (LTR)
            const x = CANVAS_LEFT_OFFSET + (depth * X_SPACING);
            const y = startY + (i * Y_SPACING) - (totalHeight / 2);
            pos[child.id] = { x, y, depth };
            calculateRecursive(child.id, depth + 1, y);
          });
        };

        calculateRecursive(null, 0, 5000); 
        setPositionsState(pos);
        
        // Auto-select start node
        const root = result.steps.find((s: FlowStep) => !s.parentId || s.parentId === "null");
        if (root) setSelectedNodeId(root.id);
      } catch (err: any) {
        setError(err.message || "Strategic Engine Offline.");
      } finally {
        setLoading(false);
      }
    };

    runAnalysis();
  }, [problemText, navigate]);

  const handleUpdateNode = (updatedNode: Partial<FlowStep>) => {
    if (!data || !selectedNodeId) return;
    const newData = {
      ...data,
      steps: data.steps.map(s => s.id === selectedNodeId ? { ...s, ...updatedNode } : s) as FlowStep[]
    };
    setData(newData);
    // Silent save to local storage
    if (localProblemId) {
      const problems = NeuralStorage.getProblems();
      const idx = problems.findIndex(p => p.id === localProblemId);
      if (idx !== -1) {
        problems[idx].data = newData;
        localStorage.setItem("flowsynth_problems", JSON.stringify(problems));
      }
    }
  };

  const handleAddNode = () => {
    if (!data || !selectedNodeId) return;
    const newId = `node-${Date.now()}`;
    const newStep: FlowStep = {
      id: newId,
      parentId: selectedNodeId,
      title: "New Tactical Node",
      description: "Defining sub-strategy...",
      icon: "Cpu",
      detailedExplanation: "Strategic deconstruction in progress.",
      advancedInsights: ["Identify core vector", "Deploy resources"]
    };
    
    const newData = { ...data, steps: [...data.steps, newStep] };
    setData(newData);
    
    const parentPos = positionsState[selectedNodeId];
    if (parentPos) {
      setPositionsState(prev => ({
        ...prev,
        [newId]: { x: parentPos.x + 400, y: parentPos.y, depth: parentPos.depth + 1 }
      }));
    }
    setSelectedNodeId(newId);
  };

  const handleDeleteNode = () => {
    if (!data || !selectedNodeId) return;
    const newData = {
      ...data,
      steps: data.steps.filter(s => s.id !== selectedNodeId && s.parentId !== selectedNodeId)
    };
    setData(newData);
    setSelectedNodeId(null);
  };

  // --- Path Highlighting Logic ---
  const getPathToRoot = (nodeId: string | null): string[] => {
    if (!nodeId || !data) return [];
    const path: string[] = [];
    let currentId: string | null = nodeId;
    while (currentId) {
      path.push(currentId);
      currentId = data.steps.find(s => s.id === currentId)?.parentId || null;
    }
    return path;
  };

  const activePath = useMemo(() => getPathToRoot(selectedNodeId), [selectedNodeId, data]);

  const selectedNode = useMemo(() => 
    data?.steps.find(s => s.id === selectedNodeId), [data, selectedNodeId]);

  if (loading) {
    return (
      <div className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center p-6 text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="w-48 h-48 border border-dashed border-accent/20 rounded-full flex items-center justify-center"
        >
          <BrainCircuit size={64} className="text-accent animate-pulse" />
        </motion.div>
        <h2 className="text-4xl font-black text-white mt-16 mb-4 uppercase italic tracking-tighter">Synthesizing Strategy</h2>
        <div className="tagline !text-accent/60 !mb-0 tracking-[0.6em]">Neural Matrix Generation in Progress</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center p-6">
        <div className="max-w-md p-16 glass-card text-center">
          <ShieldAlert size={80} className="text-accent mx-auto mb-10" />
          <h2 className="text-3xl font-black mb-6 uppercase tracking-tight">Engine Interruption</h2>
          <p className="text-muted-foreground font-medium mb-12">{error}</p>
          <button onClick={() => navigate("/")} className="btn-primary w-full">Origin Terminal</button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-background flex flex-col overflow-hidden">
      {/* Decorative Atmosphere */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.2] bg-[radial-gradient(circle_at_20%_20%,_#6366f111,_transparent),_radial-gradient(circle_at_80%_80%,_#a855f711,_transparent)]" />
      
      {/* Header Bar */}
      <div className="relative z-[100] px-8 py-5 flex justify-between items-center bg-background/80 backdrop-blur-3xl border-b border-white/5">
        <div className="flex items-center gap-6">
          <button onClick={() => navigate("/")} className="p-3 hover:bg-white/5 rounded-2xl transition-all text-muted-foreground hover:text-white">
            <ArrowLeft size={24} />
          </button>
          <div className="h-8 w-px bg-white/10" />
          <div className="flex flex-col">
            <div className="text-[9px] font-black uppercase tracking-[0.4em] text-accent">Active Strategic Matrix</div>
            <span className="text-lg font-black text-white tracking-tighter uppercase italic truncate max-w-[400px]">{problemText}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 px-6 py-2.5 bg-white/5 border border-white/10 rounded-full">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50">Neural Synapse Optimal</span>
          </div>
          <button onClick={() => navigate("/dashboard")} className="btn-primary !py-2.5 flex items-center gap-3">
            Dashboard <LayoutDashboard size={18} />
          </button>
        </div>
      </div>

      <div className="flex-1 flex relative">
        {/* --- LEFT: CANVAS (70%) --- */}
        <div className="flex-1 relative overflow-hidden bg-background">
          <TransformWrapper
            initialScale={0.8}
            minScale={0.1}
            maxScale={2}
            centerOnInit
            limitToBounds={false}
            disabled={isDraggingNode}
          >
            {({ zoomIn, zoomOut, resetTransform }) => (
              <>
                {/* Canvas Tools */}
                <div className="absolute bottom-10 left-10 z-[80] flex items-center gap-2 p-2 glass-card !rounded-full">
                  <button onClick={() => zoomIn()} className="p-4 hover:bg-white/5 rounded-full text-muted-foreground hover:text-white"><ZoomIn size={24} /></button>
                  <button onClick={() => zoomOut()} className="p-4 hover:bg-white/5 rounded-full text-muted-foreground hover:text-white"><ZoomOut size={24} /></button>
                  <button onClick={() => resetTransform()} className="p-4 hover:bg-white/5 rounded-full text-muted-foreground hover:text-white"><Maximize size={24} /></button>
                </div>

                <TransformComponent wrapperClass="!w-full !h-full" contentClass="!w-full !h-full">
                  <div className="relative w-[10000px] h-[10000px]">
                    {/* CONNECTIONS Layer */}
                    <svg className="absolute inset-0 pointer-events-none w-full h-full">
                      <defs>
                        <linearGradient id="activeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#6366f1" />
                          <stop offset="100%" stopColor="#a855f7" />
                        </linearGradient>
                      </defs>
                      {data.steps.map(step => {
                        if (!step.parentId || step.parentId === "null") return null;
                        const start = positionsState[step.parentId];
                        const end = positionsState[step.id];
                        if (!start || !end) return null;

                        const startX = 5000 + start.x + 280; // Right side of parent
                        const startY = 5000 + start.y + 60; // Center height of parent
                        const endX = 5000 + end.x; // Left side of child
                        const endY = 5000 + end.y + 60; // Center height of child

                        const isHighlighted = activePath.includes(step.id) && activePath.includes(step.parentId);
                        const dimConnection = selectedNodeId && !isHighlighted;

                        return (
                          <g key={`flow-path-${step.id}`}>
                            {/* Background shadow path */}
                            <path 
                              d={`M ${startX} ${startY} C ${startX + 100} ${startY}, ${endX - 100} ${endY}, ${endX} ${endY}`}
                              fill="none"
                              stroke="rgba(255,255,255,0.02)"
                              strokeWidth={6}
                              strokeLinecap="round"
                            />
                            {/* Main Connection Path */}
                            <motion.path
                              initial={{ pathLength: 0, opacity: 0 }}
                              animate={{ 
                                pathLength: 1, 
                                opacity: dimConnection ? 0.05 : 1,
                                stroke: isHighlighted ? "url(#activeGradient)" : "rgba(255,255,255,0.15)"
                              }}
                              d={`M ${startX} ${startY} C ${startX + 100} ${startY}, ${endX - 100} ${endY}, ${endX} ${endY}`}
                              fill="none"
                              strokeWidth={isHighlighted ? 4 : 2}
                              className="transition-all duration-500"
                              strokeLinecap="round"
                            />
                            {/* Animated Pulse Path */}
                            {isHighlighted && (
                              <motion.path
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={{ pathLength: [0, 1], opacity: [0, 1, 0] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                d={`M ${startX} ${startY} C ${startX + 100} ${startY}, ${endX - 100} ${endY}, ${endX} ${endY}`}
                                fill="none"
                                stroke="#fff"
                                strokeWidth={2}
                              />
                            )}
                          </g>
                        );
                      })}
                    </svg>

                    {/* NODES Layer */}
                    {data.steps.map(step => {
                      const pos = positionsState[step.id];
                      if (!pos) return null;
                      const isSelected = selectedNodeId === step.id;
                      const isHighlighted = activePath.includes(step.id);
                      const dimNode = selectedNodeId && !isHighlighted;

                      return (
                        <motion.div
                          key={step.id}
                          drag
                          dragMomentum={false}
                          onDragStart={() => setIsDraggingNode(true)}
                          onDragEnd={(_, info) => {
                            setIsDraggingNode(false);
                            setPositionsState(prev => ({
                              ...prev,
                              [step.id]: { 
                                ...prev[step.id], 
                                x: prev[step.id].x + info.offset.x,
                                y: prev[step.id].y + info.offset.y
                              }
                            }));
                          }}
                          className="absolute z-10"
                          style={{
                            left: 5000 + pos.x,
                            top: 5000 + pos.y,
                            opacity: dimNode ? 0.2 : 1,
                            scale: dimNode ? 0.9 : 1
                          }}
                        >
                          <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            whileHover={{ scale: 1.05, y: -5 }}
                            onClick={() => setSelectedNodeId(step.id)}
                            onMouseEnter={() => setHoveredNodeId(step.id)}
                            onMouseLeave={() => setHoveredNodeId(null)}
                            className={cn(
                              "w-[280px] h-[120px] p-6 cursor-grab active:cursor-grabbing transition-all duration-500 rounded-[28px] border-2 relative flex items-center gap-6",
                              isSelected 
                                ? "bg-slate-900 border-accent text-white shadow-[0_0_40px_rgba(99,102,241,0.3)]" 
                                : "bg-white/5 border-white/10 text-white hover:border-white/20 hover:bg-white/10"
                            )}
                          >
                            <div className={cn(
                              "w-14 h-14 rounded-2xl flex items-center justify-center shrink-0",
                              isSelected ? "bg-accent text-white" : "bg-white/10 text-accent/80"
                            )}>
                              <DynamicIcon name={step.icon} size={28} />
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <h3 className={cn("text-[13px] font-black uppercase tracking-tight leading-tight line-clamp-2")}>
                                {step.title}
                              </h3>
                              <div className="mt-2 flex items-center gap-2">
                                <div className="h-1 flex-1 bg-white/5 rounded-full overflow-hidden">
                                   <div className="h-full bg-accent/40 w-1/3" />
                                </div>
                                <span className="text-[8px] font-black text-white/30 uppercase tracking-widest">L{pos.depth + 1}</span>
                              </div>
                            </div>

                            {isSelected && (
                              <motion.div 
                                layoutId="activeNodeGlow"
                                className="absolute -inset-1 rounded-[30px] bg-accent/20 blur-[8px] -z-10"
                              />
                            )}
                          </motion.div>
                        </motion.div>
                      );
                    })}
                  </div>
                </TransformComponent>
              </>
            )}
          </TransformWrapper>
        </div>

        {/* --- RIGHT: DETAIL PANEL (30%) --- */}
        <div className="w-[30%] min-w-[450px] bg-background border-l border-white/5 flex flex-col relative z-[90]">
           <AnimatePresence mode="wait">
             {selectedNode ? (
               <motion.div
                 key={selectedNode.id}
                 initial={{ x: 20, opacity: 0 }}
                 animate={{ x: 0, opacity: 1 }}
                 exit={{ x: 20, opacity: 0 }}
                 className="flex-1 flex flex-col p-12 overflow-y-auto"
               >
                 {/* Detail Panel Content */}
                 <div className="flex justify-between items-start mb-16">
                    <div className="tagline !text-accent !mb-0 tracking-[0.6em]">Tactical Vector Selected</div>
                    <button onClick={() => setSelectedNodeId(null)} className="p-3 hover:bg-white/5 rounded-xl text-muted-foreground hover:text-white transition-all">
                      <X size={24} />
                    </button>
                 </div>

                 <div className="flex items-center gap-10 mb-16">
                    <div className="w-28 h-28 glass-card !rounded-[40px] flex items-center justify-center text-accent shadow-2xl relative">
                       <div className="absolute inset-0 bg-accent/10 blur-xl rounded-full" />
                       <DynamicIcon name={selectedNode.icon} size={48} className="relative z-10" />
                    </div>
                    <div className="flex-1">
                       {isEditingTitle ? (
                         <input 
                           autoFocus
                           className="bg-transparent border-b-2 border-accent text-3xl font-black text-white tracking-tighter w-full outline-none py-2 uppercase italic"
                           value={editedTitle}
                           onChange={(e) => setEditedTitle(e.target.value)}
                           onBlur={() => {
                             setIsEditingTitle(false);
                             handleUpdateNode({ title: editedTitle });
                           }}
                           onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
                         />
                       ) : (
                         <h2 
                          onClick={() => {
                            setEditedTitle(selectedNode.title);
                            setIsEditingTitle(true);
                          }}
                          className="text-4xl font-black text-white tracking-tighter leading-none mb-3 uppercase italic cursor-pointer hover:text-accent transition-all group flex items-center gap-4"
                        >
                          {selectedNode.title}
                          <Edit3 size={20} className="opacity-0 group-hover:opacity-40" />
                        </h2>
                       )}
                       <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full">
                          <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 italic">Operational Priority: High</span>
                       </div>
                    </div>
                 </div>

                 {/* Action Buttons */}
                 <div className="grid grid-cols-3 gap-6 mb-20">
                    <ActionButton icon={<Plus />} label="Sub-Path" onClick={handleAddNode} />
                    <ActionButton icon={<Edit3 />} label="Refine" onClick={() => setIsEditingTitle(true)} />
                    <ActionButton icon={<Trash2 />} label="Prune" onClick={handleDeleteNode} danger />
                 </div>

                 <div className="space-y-20">
                    <section>
                       <div className="tagline !text-white/20 !mb-8">Synthesis Intelligence</div>
                       <div className="space-y-8">
                         <div className="space-y-4">
                            <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-accent">Definition & Intent</h4>
                            <p className="text-xl text-white/80 font-medium leading-relaxed tracking-tight italic">
                               {selectedNode.detailedExplanation.split('\n')[0]}
                            </p>
                         </div>
                       </div>
                    </section>

                    <section>
                       <div className="tagline !text-white/20 !mb-10">Strategic Deployment</div>
                       <div className="space-y-6">
                          {selectedNode.advancedInsights.map((insight, i) => (
                            <div key={i} className="group p-8 bg-white/[0.03] border border-white/5 rounded-[32px] flex gap-8 hover:border-accent/40 hover:bg-white/[0.06] transition-all">
                               <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-accent group-hover:bg-accent group-hover:text-white transition-all">
                                  <Check size={20} />
                               </div>
                               <div className="flex-1">
                                  <div className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20 mb-2">Protocol #{i+1}</div>
                                  <span className="text-[15px] font-black text-white/90 uppercase tracking-tight leading-snug">{insight}</span>
                               </div>
                            </div>
                          ))}
                       </div>
                    </section>
                 </div>

                 <div className="mt-auto pt-16">
                    <button className="btn-primary w-full flex items-center justify-center gap-6 group scale-105 hover:scale-110">
                       <Sparkles size={20} className="group-hover:rotate-12 transition-transform" />
                       <span>Execute Deployment</span>
                    </button>
                    <div className="mt-8 flex justify-center gap-10 text-[9px] font-black uppercase tracking-[0.4em] text-white/20">
                       <span>Encrypt Output</span>
                       <span>//</span>
                       <span>Share Matrix</span>
                    </div>
                 </div>
               </motion.div>
             ) : (
               <div className="flex-1 flex flex-col items-center justify-center p-12 text-center opacity-30 grayscale">
                  <Database size={64} className="mb-8" />
                  <div className="tagline justify-center mb-4">Awaiting Node Selection</div>
                  <p className="text-xs font-black uppercase tracking-widest max-w-[240px]">Navigate the strategic lattice and select a vector for deep deconstruction.</p>
               </div>
             )}
           </AnimatePresence>
        </div>
      </div>

      {/* Floating Coordinate Status */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 pointer-events-none z-[100]">
         <div className="px-10 py-5 bg-background/80 backdrop-blur-3xl border border-white/5 rounded-full flex items-center gap-6 shadow-2xl">
            <Activity size={16} className="text-accent animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 italic">Logic Lattice Engine // RTL_MODE_DEACTIVATED // GEN-X</span>
         </div>
      </div>
    </div>
  );
}

function ActionButton({ icon, label, onClick, danger }: any) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center p-6 rounded-[32px] border transition-all gap-3 group",
        danger 
          ? "bg-red-500/5 border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white" 
          : "bg-white/5 border-white/10 text-white/60 hover:bg-accent hover:text-white hover:border-accent"
      )}
    >
      <div className="transition-transform group-hover:scale-110">{icon}</div>
      <span className="text-[9px] font-black uppercase tracking-widest leading-none">{label}</span>
    </button>
  );
}
