import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "../styles/LiveFeedback.css";

export function LiveFeedback() {
  const [transcription, setTranscription] = useState([]);
  const [sentiment, setSentiment] = useState("Neutral");
  const [pace, setPace] = useState("Normal");
  const [confidence, setConfidence] = useState(75);

  useEffect(() => {
    const text = "This is a sample AI-generated transcription...";
    let index = 0;
    let tempArray = [];

    const interval = setInterval(() => {
      if (index < text.length) {
        tempArray.push(text[index]); 
        setTranscription([...tempArray]);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      className="feedback-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
    >
      {/* Transcription Box */}
      <motion.div
        className="transcription-box"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {transcription.join("")}
      </motion.div>

      {/* Sentiment Analysis */}
      <motion.div
        className={`sentiment-box ${sentiment.toLowerCase()}`}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        Sentiment: {sentiment}
      </motion.div>

      {/* Speaking Pace Indicator */}
      <motion.div
        className="pace-indicator"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
      >
        Pace: {pace}
      </motion.div>

      {/* Confidence Score Meter */}
      <motion.div
        className="confidence-meter"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="progress-circle" style={{ "--progress": confidence + "%" }}>
          {confidence}%
        </div>
      </motion.div>
    </motion.div>
  );
}
