import React from 'react';
import './LoadingScreen.css';

/**
 * LoadingScreen Component
 * 
 * A reusable loading indicator with customizable message and styling.
 * Features an animated spinner with dots and supports overlay mode.
 * Used throughout the app to provide user feedback during async operations.
 * 
 * @param {Object} props - Component props
 * @param {string} props.message - Loading message to display (default: "Loading...")
 * @param {string} props.size - Size of the spinner ("small", "medium", "large")
 * @param {boolean} props.overlay - Whether to render as fullscreen overlay
 */
const LoadingScreen = ({ message = "Loading...", size = "large", overlay = false }) => {
    // Determine container class based on overlay requirement
    const containerClass = overlay ? "loading-screen-overlay" : "loading-screen-container";
    
    return (
        <div className={containerClass}>
            <div className="loading-screen-content">
                {/* Animated spinning indicator */}
                <div className={`loading-spinner ${size}`}>
                    <div className="spinner-ring">
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                </div>
                {/* Loading message with animated dots */}
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
