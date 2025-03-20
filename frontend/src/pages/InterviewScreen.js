import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import "../styles/InterviewScreen.css";

// 🎯 20 Predefined Interview Questions
const QUESTIONS = [
  "Tell me about yourself.",
  "What are your strengths and weaknesses?",
  "Why do you want this job?",
  "Describe a challenging situation and how you handled it.",
  "Where do you see yourself in 5 years?",
  "What motivates you?",
  "How do you handle pressure and stress?",
  "Give an example of teamwork experience.",
  "Why should we hire you?",
  "Tell me about a time you failed and what you learned.",
  "Describe your leadership style.",
  "How do you handle criticism?",
  "What are your salary expectations?",
  "What do you know about our company?",
  "Tell me about a project you led.",
  "How do you prioritize tasks?",
  "What skills make you a good fit for this role?",
  "How do you stay updated in your field?",
  "What is your biggest professional achievement?",
  "Do you have any questions for us?"
];

export function InterviewScreen() {
  const [isRecording, setIsRecording] = useState(false);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [response, setResponse] = useState("");
  const [responses, setResponses] = useState([]); // ✅ Stores all responses
  const mediaRecorderRef = useRef(null);
  const audioChunks = useRef([]);
  const navigate = useNavigate();

  // 🎯 Select 6 random questions on load
  useEffect(() => {
    const shuffled = [...QUESTIONS].sort(() => Math.random() - 0.5);
    setSelectedQuestions(shuffled.slice(0, 6));
  }, []);

  // 🎤 Start Recording (Mic Input)
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.current.push(event.data);
        }
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error("❌ Microphone access denied:", error);
    }
  };

  // 🛑 Stop Recording & Send to Backend for Speech Processing
  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunks.current, { type: "audio/wav" });
        const formData = new FormData();
        formData.append("audio", audioBlob);

        try {
          const res = await fetch("http://127.0.0.1:8000/interview/transcribe", {
            method: "POST",
            body: formData,
          });

          if (!res.ok) {
            throw new Error(`Server error: ${res.status}`);
          }

          const data = await res.json();
          setResponse(data.transcription);
        } catch (error) {
          console.error("❌ Speech processing failed:", error);
        }
      };
      setIsRecording(false);
    }
  };

  // 📤 Submit Response to Backend
  const submitResponse = async () => {
    if (!response.trim()) {
      alert("❗ Please enter a response before submitting.");
      return;
    }

    try {
      const question = selectedQuestions[currentQuestionIndex];

      const res = await fetch("http://127.0.0.1:8000/interview/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, answer: response }),
      });

      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }

      const data = await res.json();
      console.log("✅ Evaluation:", data);

      // Store response in array
      setResponses((prevResponses) => [
        ...prevResponses,
        { question, answer: response, score: data.score },
      ]);

      // Move to next question or finish interview
      if (currentQuestionIndex < selectedQuestions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setResponse("");
        audioChunks.current = [];
      } else {
        // Send all responses to final report
        fetch("http://127.0.0.1:8000/interview/final_report", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ responses }),
        })
          .then((res) => res.json())
          .then((data) => {
            console.log("✅ Final Report Data:", data);
            localStorage.setItem("finalReport", JSON.stringify(data));
            navigate("/report");
          })
          .catch((error) => console.error("❌ Final Report Error:", error));
      }
    } catch (error) {
      console.error("❌ Error evaluating response:", error);
    }
  };

  return (
    <div className="interview-container">
      <motion.div className="question-box">
        {selectedQuestions.length > 0 ? selectedQuestions[currentQuestionIndex] : "Loading questions..."}
      </motion.div>

      <div className="input-section">
        <motion.button
          className={`mic-button ${isRecording ? "recording" : ""}`}
          onClick={isRecording ? stopRecording : startRecording}
        >
          {isRecording ? <FaMicrophoneSlash /> : <FaMicrophone />}
        </motion.button>

        <motion.input
          type="text"
          className="text-input"
          placeholder="Type your response..."
          value={response}
          onChange={(e) => setResponse(e.target.value)}
        />
      </div>

      <div className="button-container">
        <motion.button className="submit-btn" onClick={submitResponse}>
          Submit Response ✅
        </motion.button>
      </div>
    </div>
  );
}
