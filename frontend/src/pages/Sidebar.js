import React from "react";
import { Link } from "react-router-dom";
import "../styles/Sidebar.css";

const Sidebar = ({ activePage, setActivePage }) => {
  const pages = [
    { name: "Landing", path: "/landing" },
    { name: "Setup", path: "/setup" },
    { name: "Interview", path: "/interview" },
    { name: "Live Feedback", path: "/feedback" },
    { name: "Final Report", path: "/report" },
  ];

  return (
    <div className="w-64 bg-gray-800 text-white p-4 flex flex-col">
      <h2 className="text-xl font-bold mb-4">AI Interview</h2>
      <nav className="space-y-2">
        {pages.map((page) => (
          <Link
            key={page.name}
            to={page.path}
            className={`block p-2 rounded-lg ${activePage === page.name.toLowerCase() ? "bg-gray-600" : "hover:bg-gray-700"}`}
            onClick={() => setActivePage(page.name.toLowerCase())}
          >
            {page.name}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
