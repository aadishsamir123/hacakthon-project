import React from 'react';
import './LoadingScreen.css';

const LoadingScreen = ({ message = "Loading...", size = "large", overlay = false }) => {
    const containerClass = overlay ? "loading-screen-overlay" : "loading-screen-container";
    
    return (
        <div className={containerClass}>
            <div className="loading-screen-content">
                <div className={`loading-spinner ${size}`}>
                    <div className="spinner-ring">
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                </div>
                <div className="loading-text">
                    <h3>{message}</h3>
                    <div className="loading-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoadingScreen;
