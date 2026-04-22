import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { Navbar } from "./components/Navbar";
import { LandingPage } from "./pages/LandingPage";
import { Dashboard } from "./pages/Dashboard";
import { ProblemSolver } from "./pages/ProblemSolver";
import { HistoryPage } from "./pages/HistoryPage";
import { FlowExperience } from "./pages/FlowExperience";
import { JourneyBuilder } from "./pages/JourneyBuilder";
import { Footer } from "./components/Footer";

function AppContent() {
  const { loading } = useAuth();
  const location = useLocation();
  const isFullCanvasPage = location.pathname === "/flow" || location.pathname === "/journey";

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-8">
        <div className="w-16 h-16 border-2 border-accent border-t-transparent rounded-full animate-spin shadow-[0_0_20px_rgba(99,102,241,0.2)]"></div>
        <div className="font-mono text-[9px] text-accent font-black uppercase tracking-[0.5em] animate-pulse italic">Initializing Neural Core</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-accent/30 selection:text-white">
      {!isFullCanvasPage && <Navbar />}
      <main className={isFullCanvasPage ? "" : "pt-0 min-h-screen"}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/solve" element={<ProblemSolver />} />
          <Route path="/flow" element={<FlowExperience />} />
          <Route path="/journey" element={<JourneyBuilder />} />
          <Route path="/history" element={<HistoryPage />} />
        </Routes>
      </main>
      
      {!isFullCanvasPage && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}
