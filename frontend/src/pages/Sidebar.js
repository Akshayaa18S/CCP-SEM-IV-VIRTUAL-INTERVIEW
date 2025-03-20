import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { signInWithGoogle, signInWithGithub, logout, auth, listenForAuthChanges } from "../services/firebase";
import "../styles/Sidebar.css";

const Header = () => {
  const [user, setUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  // 🔹 Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = listenForAuthChanges(setUser);
    return () => unsubscribe();
  }, []);

  return (
    <header className="header">
      <div className="logo">AI Interview</div>
      <nav className={`nav-links ${isOpen ? "open" : ""}`}>
        <Link to="/landing">Home</Link>
        <Link to="/report">Final Report</Link>
        <Link to="/past-interviews">Past Interviews</Link>
        {user ? (
          <>
            <span className="user-info">
              <span className="user-name">{user.displayName}</span>
            </span>
            <button onClick={logout} className="auth-btn">Logout</button>
          </>
        ) : (
          <>
            <button onClick={signInWithGoogle} className="auth-btn">Login with Google</button>
            <button onClick={signInWithGithub} className="auth-btn">Login with GitHub</button>
          </>
        )}
      </nav>
      <div className="toggle-btn" onClick={() => setIsOpen(!isOpen)}>
        ☰
      </div>
    </header>
  );
};

export default Header;
