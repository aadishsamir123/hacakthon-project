import React from 'react';
import './BanNotification.css';

const BanNotification = ({ banInfo, onClose }) => {
    if (!banInfo || !banInfo.isBanned) {
        return null;
    }

    const formatExpirationTime = (expiresAt) => {
        const now = new Date();
        const expiry = new Date(expiresAt);
        const timeLeft = expiry - now;
        
        if (timeLeft <= 0) {
            return 'Expired';
        }
        
        const hours = Math.floor(timeLeft / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        
        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        } else {
            return `${minutes}m`;
        }
    };

    return (
        <div className="ban-notification-overlay">
            <div className="ban-notification">
                <div className="ban-header">
                    <div className="ban-icon">🚫</div>
                    <h2>Account Temporarily Restricted</h2>
                    {onClose && (
                        <button className="close-btn" onClick={onClose}>
                            ✕
                        </button>
                    )}
                </div>
                
                <div className="ban-content">
                    <p className="ban-reason">
                        <strong>Reason:</strong> {banInfo.reason}
                    </p>
                    
                    <div className="ban-details">
                        <div className="detail-item">
                            <span className="detail-label">Time Remaining:</span>
                            <span className="detail-value time-remaining">
                                {formatExpirationTime(banInfo.expiresAt)}
                            </span>
                        </div>
                        
                        <div className="detail-item">
                            <span className="detail-label">Expires At:</span>
                            <span className="detail-value">
                                {banInfo.expiresAt.toLocaleString()}
                            </span>
                        </div>
                        
                        <div className="detail-item">
                            <span className="detail-label">Violation Count:</span>
                            <span className="detail-value violation-count">
                                #{banInfo.violationCount}
                            </span>
                        </div>
                    </div>
                    
                    <div className="ban-message">
                        <h3>🌟 Let's Make This Community Better!</h3>
                        <p>
                            We want everyone to feel safe and happy here. During this time, 
                            please think about how we can all use kind words that help and 
                            support each other.
                        </p>
                        
                        <div className="guidelines">
                            <h4>✨ Community Guidelines:</h4>
                            <ul>
                                <li className="guidelines-li" style={{ color: "#2e7d32" }}>🤝 Be kind and respectful to everyone</li>
                                <li className="guidelines-li" style={{ color: "#2e7d32" }}>💝 Use words that help and encourage</li>
                                <li className="guidelines-li" style={{ color: "#2e7d32" }}>🛡️ Report bullying or mean behavior</li>
                                <li className="guidelines-li" style={{ color: "#2e7d32" }}>🌈 Celebrate differences and be inclusive</li>
                                <li className="guidelines-li" style={{ color: "#2e7d32" }}>📖 Share experiences that can help others</li>
                            </ul>
                        </div>
                        
                        {banInfo.violationCount >= 3 && (
                            <div className="warning-notice">
                                <p className="warning-text">
                                    ⚠️ <strong>Multiple Violations Notice:</strong> 
                                    Further violations may result in longer restrictions. 
                                    Please review our community guidelines carefully.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
                
                <div className="ban-footer">
                    <p className="footer-text">
                        Thank you for helping us maintain a safe and positive community! 💖
                    </p>
                </div>
            </div>
        </div>
    );
};

export default BanNotification;
