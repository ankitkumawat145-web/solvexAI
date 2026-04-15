import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase";
import { Navbar } from "./components/Navbar";
import { LandingPage } from "./pages/LandingPage";
import { AuthPage } from "./pages/AuthPage";
import { Dashboard } from "./pages/Dashboard";
import { ProblemSolver } from "./pages/ProblemSolver";
import { HistoryPage } from "./pages/HistoryPage";

export default function App() {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-white text-slate-900 selection:bg-accent/20">
        <Navbar />
        <main className="pt-20 min-h-[calc(100vh-80px)]">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={!user ? <AuthPage /> : <Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/auth" />} />
            <Route path="/solve" element={user ? <ProblemSolver /> : <Navigate to="/auth" />} />
            <Route path="/history" element={user ? <HistoryPage /> : <Navigate to="/auth" />} />
          </Routes>
        </main>
        
        <footer className="py-12 border-t border-slate-100 px-12 flex flex-col md:flex-row items-center justify-between gap-6 font-mono text-[10px] text-slate-400 uppercase tracking-[0.2em] font-bold">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              System Status: Optimal
            </span>
            <span className="w-px h-3 bg-slate-200" />
            <span>Model: Gemini-3-Flash</span>
          </div>
          <div>© 2024 SolveX AI Platform • All Rights Reserved</div>
        </footer>
      </div>
    </Router>
  );
}
