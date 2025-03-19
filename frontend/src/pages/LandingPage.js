import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import "../styles/LandingPage.css"; // Import the separate CSS file

export function LandingPage() {
  return (
    <div className="landing-container">
      {/* Animated Background */}
      <motion.div
        className="animated-bg"
        animate={{ opacity: [0.3, 0.4, 0.3] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Hero Section */}
      <motion.h1
        className="landing-title"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        Ace Your Next Interview with AI
      </motion.h1>

      <motion.p
        className="landing-subtext"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3 }}
      >
        Get real-time feedback, practice with AI-powered questions, and improve your confidence.
      </motion.p>

      {/* AI Illustration */}
      <motion.img
        src="/ai-illustration.png"
        alt="AI Interview Illustration"
        className="ai-illustration floating"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: "easeInOut" }}
        whileHover={{ scale: 1.05 }}
      />

      {/* CTA Button */}
      <motion.div
        className="button-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <Link to="/setup">
          <motion.button
            className="shiny-btn"
            whileHover={{ boxShadow: "0px 0px 12px rgba(0, 255, 255, 0.8)" }}
          >
            <span className="btn-text">Get Started</span>
          </motion.button>
        </Link>
      </motion.div>
    </div>
  );
}
