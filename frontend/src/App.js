import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { LandingPage } from './pages/LandingPage';
import { SetupPage } from "./pages/SetupPage.js";
import { InterviewScreen } from "./pages/InterviewScreen";
import { LiveFeedback } from "./pages/LiveFeedback";
import { FinalReport } from "./pages/FinalReport";
import Sidebar from "./pages/Sidebar";

const App = () => {
  const [activePage, setActivePage] = useState("landing");

  return (
    <Router>
      <div className="flex h-screen">
    
        <div className="flex-1 p-4">
          <Routes>
            <Route path="/landing" element={<LandingPage />} />
            <Route path="/setup" element={<SetupPage />} />
            <Route path="/interview" element={<InterviewScreen />} />
            <Route path="/feedback" element={<LiveFeedback />} />
            <Route path="/report" element={<FinalReport />} />
            <Route path="/*" element={<Navigate to="/landing" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
