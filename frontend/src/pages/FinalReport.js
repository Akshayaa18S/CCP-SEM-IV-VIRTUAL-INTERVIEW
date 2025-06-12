import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { auth, saveInterviewReport } from "../services/firebase";
import "../styles/FinalReport.css";

export function FinalReport() {
  const [score, setScore] = useState(null);
  const [finalFeedback, setFinalFeedback] = useState("Fetching AI feedback...");
  const [suggestions, setSuggestions] = useState("Fetching suggestions...");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedResponses = JSON.parse(localStorage.getItem("interviewResponses"));

    if (!storedResponses || storedResponses.length !== 6) {
      setFinalFeedback("⚠️ No valid interview data found.");
      setSuggestions("⚠️ No suggestions available.");
      setLoading(false);
      return;
    }

    // Fetch AI Final Report
    fetch("http://127.0.0.1:8000/feedback/interview/final_report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ responses: storedResponses }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Server error");
        return res.json();
      })
      .then((data) => {
        const roundedScore = Math.round(data.scorePercentage || 0);

        setScore(roundedScore);
        setFinalFeedback(data.finalFeedback || "No final feedback provided.");
        setSuggestions(data.suggestions || "No suggestions available.");
        setLoading(false);

        // Save to Firebase
        auth.onAuthStateChanged((currentUser) => {
          if (currentUser) {
            setUser(currentUser);
            saveInterviewReport(currentUser.uid, {
              score: roundedScore,
              finalFeedback: data.finalFeedback,
              suggestions: data.suggestions,
              timestamp: new Date(),
            });
          }
        });
      })
      .catch((error) => {
        console.error("❌ Error fetching final report:", error);
        setFinalFeedback("⚠️ Error generating feedback. Try again later.");
        setSuggestions("⚠️ Unable to fetch suggestions.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <h1 className="loading-text">⏳ Generating Final Report...</h1>;
  }

  return (
    <motion.div
      className="report-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
    >
      <h1 className="report-title">Interview Performance</h1>

      {/* Score Display */}
      {score !== null ? (
        <motion.div
          className="score-circle"
          style={{ "--score": `${score}%` }}
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          {score}%
        </motion.div>
      ) : (
        <p className="error-text">⚠️ Score not available</p>
      )}

      {/* AI Feedback */}
      <div className="report-section">
        <h2>📝 AI-Powered Final Feedback</h2>
        <p>{finalFeedback}</p>
      </div>

      {/* Suggestions Section */}
      <div className="report-section">
        <h2>💡 Suggestions for Improvement</h2>
        <p>{suggestions}</p>
      </div>

      {/* Buttons */}
      <div className="button-container">
        <motion.button
          className="restart-btn"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            localStorage.removeItem("interviewResponses");
            window.location.href = "/";
          }}
        >
          🔄 Restart Interview
        </motion.button>
      </div>
    </motion.div>
  );
}
