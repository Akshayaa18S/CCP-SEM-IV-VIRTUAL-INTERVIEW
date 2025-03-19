import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import "../styles/SetupPage.css"; // Import CSS styles

export function SetupPage() {
  const [interviewType, setInterviewType] = useState("Behavioral");
  const [difficulty, setDifficulty] = useState("Intermediate");
  const [timeLimit, setTimeLimit] = useState("15 min");

  return (
    <div className="setup-container">
      {/* Heading */}
      <motion.h1
        className="setup-title"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        Customize Your Interview
      </motion.h1>

      {/* Selection Box */}
      <motion.div
        className="setup-box"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Interview Type */}
        <label className="setup-label">Interview Type</label>
        <select
          className="setup-select"
          value={interviewType}
          onChange={(e) => setInterviewType(e.target.value)}
        >
          <option>Behavioral</option>
          <option>Technical</option>
          <option>HR</option>
        </select>

        {/* Difficulty Level */}
        <label className="setup-label">Difficulty Level</label>
        <select
          className="setup-select"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
        >
          <option>Beginner</option>
          <option>Intermediate</option>
          <option>Expert</option>
        </select>

        {/* Time Limit */}
        <label className="setup-label">Time Limit</label>
        <select
          className="setup-select"
          value={timeLimit}
          onChange={(e) => setTimeLimit(e.target.value)}
        >
          <option>5 min</option>
          <option>15 min</option>
          <option>30 min</option>
        </select>

        {/* Start Interview Button */}
        <Link to="/interview">
          <motion.button
            className="setup-btn"
            whileHover={{ scale: 1.05 }}
          >
            Start Interview 🚀
          </motion.button>
        </Link>
      </motion.div>
    </div>
  );
}
