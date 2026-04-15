import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { BrainCircuit, Target, Zap, ShieldCheck, ArrowRight } from "lucide-react";
import { ProblemInput } from "@/components/ProblemInput";
import { GlassCard } from "@/components/GlassCard";

export function LandingPage() {
  const navigate = useNavigate();

  const handleProblemSubmit = (text: string) => {
    navigate("/solve", { state: { problem: text } });
  };

  return (
    <div className="relative overflow-hidden bg-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid lg:grid-cols-2 gap-20 items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="tagline">Solve. Execute. Repeat.</div>
            <h1 className="text-slate-900 leading-[1.05] mb-8 font-black">
              Turn your problems into <br />
              <span className="text-accent">clear action plans.</span>
            </h1>
            <p className="text-xl text-slate-500 max-w-lg mb-12 leading-relaxed font-medium">
              Elite life strategist AI designed to break down your complex real-life challenges into daily, trackable micro-tasks.
            </p>
            
            <div className="max-w-xl">
              <ProblemInput onSubmit={handleProblemSubmit} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="hidden lg:block relative"
          >
            <div className="absolute -inset-10 bg-accent/5 blur-[100px] rounded-full" />
            <GlassCard className="p-10 space-y-8 relative border-slate-100 shadow-2xl">
              <div className="flex justify-between items-center border-b border-slate-50 pb-6">
                <span className="text-[11px] uppercase tracking-[0.2em] text-slate-400 font-black">Execution Dashboard</span>
                <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Zap size={16} className="text-accent" />
                </div>
              </div>
              
              <div className="bg-slate-50/50 border border-slate-100 p-6 rounded-3xl space-y-4">
                <div className="text-[10px] text-accent font-black uppercase tracking-widest">Current Focus</div>
                <div className="text-lg font-black text-slate-900">Skill Transition: Web Architecture</div>
                <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "65%" }}
                    transition={{ delay: 1, duration: 1.5 }}
                    className="h-full bg-accent" 
                  />
                </div>
                <div className="flex justify-between text-[11px] text-slate-500 font-bold">
                  <span>65% Complete</span>
                  <span>Day 14 of 90</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white border border-slate-100 rounded-3xl p-6 text-center shadow-sm">
                  <div className="text-3xl font-black text-slate-900">12</div>
                  <div className="text-[10px] text-slate-400 uppercase font-black tracking-widest mt-2">Tasks Pending</div>
                </div>
                <div className="bg-white border border-slate-100 rounded-3xl p-6 text-center shadow-sm">
                  <div className="text-3xl font-black text-slate-900">4.8</div>
                  <div className="text-[10px] text-slate-400 uppercase font-black tracking-widest mt-2">Effort Score</div>
                </div>
              </div>

              <button className="w-full bg-slate-900 text-white p-5 rounded-2xl font-black text-sm cursor-pointer hover:bg-accent transition-all shadow-xl shadow-slate-200 hover:shadow-accent/20">
                View Full Roadmap
              </button>
            </GlassCard>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-40 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-24">
            <div className="tagline mx-auto justify-center">Features</div>
            <h2 className="text-slate-900 font-black mb-6">Why SolveX AI?</h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg font-medium">We don't just give advice; we build your path to success with data-driven strategies.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-10">
            <FeatureCard 
              icon={<BrainCircuit className="text-accent" />}
              title="AI Strategy Engine"
              description="Our elite life strategist AI analyzes root causes and creates non-vague execution steps."
              image="https://picsum.photos/seed/strategy/800/600"
            />
            <FeatureCard 
              icon={<Target className="text-accent" />}
              title="Action Mode"
              description="Convert complex solutions into simple daily tasks that you can track and complete."
              image="https://picsum.photos/seed/target/800/600"
            />
            <FeatureCard 
              icon={<Zap className="text-accent" />}
              title="Real-time Adjustment"
              description="Plans that evolve with you. If a step is too hard, the AI recalibrates your path."
              image="https://picsum.photos/seed/adjustment/800/600"
            />
          </div>
        </div>
      </section>

      {/* About Section with Large Image */}
      <section className="py-40 relative">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid lg:grid-cols-2 gap-24 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative rounded-[48px] overflow-hidden shadow-2xl aspect-square"
          >
            <img 
              src="https://picsum.photos/seed/workspace/1200/1200" 
              alt="Workspace" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="image-overlay opacity-30" />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="tagline">Our Philosophy</div>
            <h2 className="text-slate-900 font-black mb-8 leading-tight">Built for the <br />Modern Founder</h2>
            <p className="text-xl text-slate-500 mb-10 leading-relaxed font-medium">
              SolveX AI was born from the need for clarity in an era of information overload. We help you filter the noise and focus on what truly moves the needle.
            </p>
            <ul className="space-y-6 mb-12">
              {['Data-driven insights', 'Personalized roadmaps', 'Real-time progress tracking'].map((item, i) => (
                <li key={i} className="flex items-center gap-4 text-slate-700 font-bold text-lg">
                  <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center">
                    <ShieldCheck className="text-accent" size={16} />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
            <button onClick={() => navigate("/auth")} className="btn-primary flex items-center gap-3 px-10 py-5 text-lg">
              Start Your Journey <ArrowRight size={20} />
            </button>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-40 bg-slate-900 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img src="https://picsum.photos/seed/abstract/1920/1080" alt="Abstract" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <h2 className="text-white font-black text-5xl md:text-6xl mb-8 tracking-tight">Ready to solve your <br />next big challenge?</h2>
          <p className="text-slate-400 mb-12 text-xl font-medium max-w-2xl mx-auto">Join thousands of high-performers who use SolveX AI to execute their vision with precision.</p>
          <button onClick={() => navigate("/auth")} className="bg-white text-slate-900 px-12 py-5 rounded-2xl font-black text-xl hover:bg-accent hover:text-white transition-all shadow-2xl shadow-black/20">
            Get Started for Free
          </button>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description, image }: { icon: React.ReactNode, title: string, description: string, image: string }) {
  return (
    <motion.div
      whileHover={{ y: -12 }}
      className="glass-card overflow-hidden group border-slate-100"
    >
      <div className="relative h-64 overflow-hidden">
        <img src={image} alt={title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" referrerPolicy="no-referrer" />
        <div className="image-overlay opacity-20" />
        <div className="absolute top-6 left-6 w-12 h-12 rounded-2xl bg-white/90 backdrop-blur-md flex items-center justify-center shadow-xl border border-white/20">
          {icon}
        </div>
      </div>
      <div className="p-10">
        <h3 className="text-2xl font-black mb-4 text-slate-900 group-hover:text-accent transition-colors">{title}</h3>
        <p className="text-slate-500 leading-relaxed font-medium">{description}</p>
      </div>
    </motion.div>
  );
}
