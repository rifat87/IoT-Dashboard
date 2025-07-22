import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Register from './components/Register';
import AddSensor from './components/AddSensor';
import ProfilePage from './components/ProfilePage';
import './styles/App.css';
import ControlDevice from './components/ControlDevice';


const App = () => {
  const [darkMode, setDarkMode] = useState(false);

  const handleDarkModeToggle = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle('dark-mode', !darkMode);
  };

  return (
    <Router>
      <Navbar darkMode={darkMode} onDarkModeToggle={handleDarkModeToggle} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/add-sensor" element={<AddSensor />} />
        <Route path="/control-device" element={<ControlDevice />} />
        <Route path="/userProfile" element={<ProfilePage darkMode={darkMode} onDarkModeToggle={handleDarkModeToggle} />} />
      </Routes>
    </Router>
  );
};

export default App;
