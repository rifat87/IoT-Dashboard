import React from "react";
import "../styles/Header.css";

const Header = ({ darkMode, onToggleDarkMode }) => {
  return (
    <header className="header">
      <h1>Welcome to Your Profile</h1>
      <button className="dark-mode-toggle" onClick={onToggleDarkMode}>
        {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
      </button>
    </header>
  );
};

export default Header;
