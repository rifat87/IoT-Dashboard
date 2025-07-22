import React, { useState } from "react";
import "../styles/Sidebar.css";

const Sidebar = ({ activeTab, onTabChange }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const tabs = [
    { name: "ControlDevice", label: "Control Device" },
    { name: "Dashboard", label: "Dashboard" },
    { name: "AddSensor", label: "Add Sensor" },
  ];

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <button className="toggle-button" onClick={toggleSidebar}>
        {isCollapsed ? ">" : "<"}
      </button>
      {!isCollapsed && (
        <ul>
          {tabs.map((tab) => (
            <li
              key={tab.name}
              className={activeTab === tab.name ? "active" : ""}
              onClick={() => onTabChange(tab.name)}
            >
              {tab.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Sidebar;
