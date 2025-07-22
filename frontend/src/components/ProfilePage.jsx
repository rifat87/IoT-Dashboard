import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import "../styles/ProfilePage.css";

const ProfilePage = () => {
  const [darkMode, setDarkMode] = useState(false); // State for dark mode

  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
    // Apply dark mode class to body element
    document.body.classList.toggle("dark-mode", !darkMode);
  };

  return (
    <div className={`profile-page ${darkMode ? "dark" : "light"}`}>
      <Header darkMode={darkMode} onToggleDarkMode={handleToggleDarkMode} />
      <div className="profile-layout">
        <Sidebar activeTab="Profile" onTabChange={() => {}} />
        <div className="content-area">
          <h1 className="user-greeting">Welcome, [User's Name]!</h1>
          <p className="user-project">Your current project: IoT Dashboard</p>
          <p className="user-info">
            Here, you can control your devices, manage your dashboard, and add sensors.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
