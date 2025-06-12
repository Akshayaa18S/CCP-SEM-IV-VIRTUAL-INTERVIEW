import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import "../styles/InterviewScreen.css";

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
  "Do you have any questions for us?",
];

export function InterviewScreen() {
  const [isRecording, setIsRecording] = useState(false);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [response, setResponse] = useState("");
  const [responses, setResponses] = useState([]);
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [responseAudio, setResponseAudio] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const mediaRecorderRef = useRef(null);
  const audioChunks = useRef([]);
  const navigate = useNavigate();

  useEffect(() => {
    const shuffled = [...QUESTIONS].sort(() => Math.random() - 0.5);
    setSelectedQuestions(shuffled.slice(0, 6));

    const storedResponses = JSON.parse(localStorage.getItem("interviewResponses"));
    if (storedResponses) {
      setResponses(storedResponses);
    }
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            sampleRate: 44100
          }
        });

      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunks.current = [];

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

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunks.current, { type: "audio/wav" });
        audioChunks.current = [];

        const audioUrl = URL.createObjectURL(audioBlob);
        setRecordedAudio(audioUrl);
        setResponseAudio(audioBlob);

        // ✅ Fix: Convert Blob to File
        const audioFile = new File([audioBlob], "recording.wav", { type: "audio/wav" });
        const formData = new FormData();
        formData.append("file", audioFile);

        try {
          const res = await fetch("http://127.0.0.1:8000/interview/transcribe", {
            method: "POST",
            body: formData,
          });

          if (!res.ok) throw new Error(`Transcription server error: ${res.status}`);
          const data = await res.json();
          setResponse(data.transcription || "⚠️ Could not transcribe audio");
        } catch (error) {
          console.error("❌ Transcription failed:", error);
        }
      };

      setIsRecording(false);
    }
  };

  const retryRecording = () => {
    setRecordedAudio(null);
    setResponseAudio(null);
    setResponse("");
    setFeedback(null);
  };

  const submitResponse = async () => {
    if (!response.trim()) {
      alert("❗ Please enter a response before submitting.");
      return;
    }

    const question = selectedQuestions[currentQuestionIndex];

    try {
      const res = await fetch("http://127.0.0.1:8000/interview/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, answer: response }),
      });

      if (!res.ok) throw new Error(`Evaluation error: ${res.status}`);

      const data = await res.json();
      setFeedback(data.feedback);

      const updatedResponses = [
        ...responses,
        {
          question,
          answer: response,
          textScore: data.textScore,
          speechScore: data.speechScore || 0,
          finalScore: data.finalScore || 0,
        },
      ];

      setResponses(updatedResponses);
      localStorage.setItem("interviewResponses", JSON.stringify(updatedResponses));

      if (currentQuestionIndex < selectedQuestions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setResponse("");
        setRecordedAudio(null);
        setResponseAudio(null);
        setFeedback(null);
      } else {
        navigate("/report");
      }
    } catch (error) {
      console.error("❌ Evaluation failed:", error);
    }
  };

  return (
    <div className="interview-container">
      <motion.div className="question-box">
        {selectedQuestions.length > 0
          ? selectedQuestions[currentQuestionIndex]
          : "Loading questions..."}
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

      {recordedAudio && (
        <div className="audio-preview">
          <audio controls src={recordedAudio} />
          <button onClick={retryRecording}>🔁 Retry</button>
        </div>
      )}

      {feedback && (
        <div className="feedback-box">
          <h4>💬 Feedback:</h4>
          <p>{feedback}</p>
        </div>
      )}

      <div className="button-container">
        <motion.button className="submit-btn" onClick={submitResponse}>
          Submit Response ✅
        </motion.button>
      </div>
    </div>
  );
}
