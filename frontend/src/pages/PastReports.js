import React, { useState, useEffect } from "react";
import { getUserReports } from "../services/firebase"; // Import the function to fetch reports
import { auth } from "../services/firebase"; // Import auth for user authentication
import "../styles/FinalReport.css"; // Import the updated CSS

const PastReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      const user = auth.currentUser;
      if (user) {
        const userReports = await getUserReports(user.uid);
        setReports(userReports);
      }
      setLoading(false);
    };

    fetchReports();
  }, []);

  return (
    <div className="past-reports-container">
      <h2>Past Interview Reports</h2>
      {loading ? (
        <p className="loading">Loading reports...</p>
      ) : reports.length === 0 ? (
        <p>No past reports found.</p>
      ) : (
        reports.map((report) => (
          <div key={report.id} className="report-card">
            <p className="report-score">Score: {report.score}</p>
            
            <div className="report-section">
              <h3>Strengths</h3>
              <ul>
                {report.strengths?.map((strength, index) => (
                  <li key={index}>{strength}</li>
                ))}
              </ul>
            </div>

            <div className="report-section">
              <h3>Suggestions</h3>
              <ul>
                {report.suggestions?.map((suggestion, index) => (
                  <li key={index}>{suggestion}</li>
                ))}
              </ul>
            </div>

            <div className="report-section">
              <h3>Weaknesses</h3>
              <ul>
                {report.weaknesses?.map((weakness, index) => (
                  <li key={index}>{weakness}</li>
                ))}
              </ul>
            </div>

            <p className="report-date">
              Created At: {new Date(report.createdAt?.seconds * 1000).toLocaleString()}
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default PastReports;
