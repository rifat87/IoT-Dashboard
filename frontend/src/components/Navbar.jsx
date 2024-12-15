import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();

  // Determine the base URL dynamically
  const baseURL = window.location.hostname === 'localhost' 
    ? 'http://localhost:5000' 
    : `http://${window.location.hostname}:5000`; // Use local IP if not localhost

  const handleDashboardClick = async (e) => {
    e.preventDefault(); // Prevent default link navigation

    try {
      const response = await axios.get(`${baseURL}/dashboard`, { withCredentials: true });
      if (response.status === 200) {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Authentication failed:', error);
      alert('Please log in to access the dashboard.');
      navigate('/login'); // Redirect to login if authentication fails
    }
  };

  const handleLogoutClick = async () => {
    try {
      const response = await axios.get(`${baseURL}/logout`, { withCredentials: true });
      if (response.status === 200) {
        alert('You have been logged out successfully.');
        navigate('/');
      }
    } catch (error) {
      console.error('Logout failed:', error);
      alert('Failed to log out. Please try again.');
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">IoT Dashboard</Link>
      </div>
      <ul className="navbar-links">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <a href="/dashboard" onClick={handleDashboardClick}>
            Dashboard
          </a>
        </li>
        <li>
          <button onClick={handleLogoutClick} className="navbar-button logout-button">
            Logout
          </button>
        </li>
        <li>
          <Link to="/login">Login</Link>
        </li>
        <li>
          <Link to="/register">Register</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
