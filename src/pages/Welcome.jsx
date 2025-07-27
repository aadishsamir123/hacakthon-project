import React from 'react';
import { Link } from 'react-router-dom';
import './Welcome.css';

const Welcome = () => {
  return (
    <div className="welcome-container">
      <div className="welcome-content">
        <h1 className="app-name">hackathon project</h1>
        <p className="app-tagline">app tagline goes here</p>
        
        <div className="welcome-buttons">
          <Link to="/login" className="btn btn-primary">
            Login
          </Link>
          <Link to="/signup" className="btn btn-secondary">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
