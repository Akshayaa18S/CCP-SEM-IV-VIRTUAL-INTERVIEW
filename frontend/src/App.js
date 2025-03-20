import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { LandingPage } from './pages/LandingPage';
import { SetupPage } from "./pages/SetupPage";
import { InterviewScreen } from "./pages/InterviewScreen";
import { LiveFeedback } from "./pages/LiveFeedback";
import { FinalReport } from "./pages/FinalReport";
import Sidebar from "./pages/Sidebar"; // ✅ Sidebar includes Header
import PastReports from "./pages/PastReports";
import { signInWithGoogle, logout, listenForAuthChanges } from "./services/firebase";
import "./styles/global.css";

const App = () => {
  const [user, setUser] = useState(null);

  // 🔹 Listen for authentication changes
  useEffect(() => {
    listenForAuthChanges(setUser);
  }, []);

  return (
    <Router>
      <Sidebar user={user} logout={logout} /> {/* ✅ Sidebar contains Header */}
      <div className="app-layout">
        <div className="main-content">
          <Routes>
            {/* Public Routes */}
            <Route path="/landing" element={<LandingPage />} />

            {/* Protected Routes - Only accessible if logged in */}
            {user ? (
              <>
                <Route path="/setup" element={<SetupPage />} />
                <Route path="/interview" element={<InterviewScreen />} />
                <Route path="/feedback" element={<LiveFeedback />} />
                <Route path="/report" element={<FinalReport />} />
                <Route path="/past-interviews" element={<PastReports />} />
              </>
            ) : (
              <Route path="/*" element={<Navigate to="/landing" />} />
            )}

            {/* If user is not logged in, redirect everything to /landing */}
            {!user && <Route path="/*" element={<Navigate to="/landing" />} />}
          </Routes>

          {/* Show login button if user is not logged in */}
          {!user && (
            <div className="login-container">
              <button onClick={signInWithGoogle}>Sign in with Google</button>
            </div>
          )}
        </div>
      </div>
    </Router>
  );
};

export default App;
