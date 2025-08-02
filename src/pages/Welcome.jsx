import React from 'react';
import { Link } from 'react-router-dom';
import './Welcome.css';

/**
 * Welcome Component
 * 
 * Serves as the landing page for new users, introducing them to the application.
 * Features:
 * - Overview of app functionality and benefits
 * - Navigation options to sign up or log in
 * - Responsive design for various screen sizes
 */

const Welcome = () => {
  return (
    <div className="welcome-container">
      <div className="welcome-content">
        <h1 className="app-name">PeacePod</h1>
        <p className="app-tagline">Where every question finds a home</p>
        
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
