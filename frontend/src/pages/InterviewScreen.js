import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import "../styles/InterviewScreen.css";

export function InterviewScreen() {
  const [isRecording, setIsRecording] = useState(false);
  const [question, setQuestion] = useState("Tell me about yourself.");
  const [response, setResponse] = useState("");

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

  return (
    <div className="interview-container">
      {/* AI Question Box */}
      <motion.div
        className="question-box"
        initial={{ opacity: 0, y: -20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        {question}
      </motion.div>

      {/* Microphone Button & Text Input */}
      <div className="input-section">
        {/* Microphone Button */}
        <motion.button
          className={`mic-button ${isRecording ? "recording" : ""}`}
          whileTap={{ scale: 0.9 }}
          animate={isRecording ? { scale: [1, 1.1, 1] } : {}}
          transition={isRecording ? { duration: 1, repeat: Infinity, ease: "easeInOut" } : {}}
          onClick={toggleRecording}
        >
          {isRecording ? <FaMicrophoneSlash /> : <FaMicrophone />}
        </motion.button>

        {/* Text Input */}
        <motion.input
          type="text"
          className="text-input"
          placeholder="Type your response..."
          value={response}
          whileFocus={{ boxShadow: "0px 0px 15px rgba(147, 51, 234, 0.8)" }}
          onChange={(e) => setResponse(e.target.value)}
        />
      </div>

      {/* Next Question Button */}
      <Link to="/feedback">
        <motion.button
          className="next-btn"
          whileHover={{ scale: 1.05 }}
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          Next Question ➡️
        </motion.button>
      </Link>
    </div>
  );
}
