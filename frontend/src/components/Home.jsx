import React from 'react';
import '../styles/Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Welcome to IoT Dashboard</h1>
        <p>Monitor and control your sensors from anywhere in the world.</p>
        <div className="home-buttons">
          <a href="/login" className="home-button">Login</a>
          <a href="/register" className="home-button">Register</a>
        </div>
      </header>
    </div>
  );
};

export default Home;
