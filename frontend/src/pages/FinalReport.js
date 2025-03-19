import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "../styles/FinalReport.css";

export function FinalReport() {
  const [score, setScore] = useState(0);
  const [strengths, setStrengths] = useState([
    "Strong communication skills",
    "Confident delivery",
    "Good technical knowledge",
  ]);
  const [weaknesses, setWeaknesses] = useState([
    "Pacing slightly too fast",
    "Lack of detailed examples",
  ]);
  const [suggestions, setSuggestions] = useState([
    "Provide more real-world examples.",
    "Improve response structure.",
    "Work on maintaining a steady pace.",
  ]);

  useEffect(() => {
    setTimeout(() => setScore(85), 1000); // Simulate score calculation
  }, []);

  return (
    <motion.div
      className="report-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
    >
      <h1 className="report-title">Interview Performance</h1>

      {/* Score Display */}
      <motion.div
        className="score-circle"
        style={{ "--score": `${score}%` }}
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        {score}%
      </motion.div>

      {/* Strengths Section */}
      <div className="report-section">
        <h2>✅ Strengths</h2>
        <ul>
          {strengths.map((strength, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2 }}
            >
              {strength}
            </motion.li>
          ))}
        </ul>
      </div>

      {/* Weaknesses Section */}
      <div className="report-section">
        <h2>⚠️ Areas for Improvement</h2>
        <ul>
          {weaknesses.map((weakness, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2 }}
            >
              {weakness}
            </motion.li>
          ))}
        </ul>
      </div>

      {/* AI Suggestions */}
      <div className="report-section">
        <h2>💡 AI-Powered Suggestions</h2>
        <ul>
          {suggestions.map((suggestion, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
            >
              {suggestion}
            </motion.li>
          ))}
        </ul>
      </div>

      {/* Buttons */}
      <div className="button-container">
        <motion.button
          className="download-btn"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          📥 Download Report
        </motion.button>
        <motion.button
          className="restart-btn"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          🔄 Restart Interview
        </motion.button>
      </div>
    </motion.div>
  );
}
