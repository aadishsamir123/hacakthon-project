import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
    const { currentUser, logout, getUserData } = useAuth();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            if (currentUser) {
                try {
                    const data = await getUserData(currentUser.uid);
                    setUserData(data);
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            }
            setLoading(false);
        };

        fetchUserData();
    }, [currentUser, getUserData]);

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/welcome');
        } catch (error) {
            console.error('Failed to log out:', error);
        }
    };

    if (loading) {
        return (
            <div className="home-container">
                <div className="loading">Loading...</div>
            </div>
        );
    }

    return (
        <div className="home-container">
            <div className="home-content">
                <header className="home-header">
                    <h1>Welcome to hackathon project!</h1>
                    <button onClick={handleLogout} className="logout-btn">
                        Logout
                    </button>
                </header>

                <h1>This page is currently a placeholder and <i>will</i> change.</h1>
                <h3>‏</h3>

                <div className="user-info-card">
                    <h2>Currently Logged-In User Profile Information (/users/uid/[field])</h2>

                    <div className="info-grid">
                        <div className="info-item">
                            <label>users/uid/name:</label>
                            <span className="code">{userData?.name || currentUser?.displayName || 'N/A'}</span>
                        </div>

                        <div className="info-item">
                            <label>users/uid/email:</label>
                            <span className="code">{currentUser?.email || 'N/A'}</span>
                        </div>

                        <div className="info-item">
                            <label>users/uid/uid:</label>
                            <span className="code">{currentUser?.uid || 'N/A'}</span>
                        </div>

                        <div className="info-item">
                            <label>users/uid/createdAt:</label>
                            <span className="code">
                                {userData?.createdAt
                                    ? new Date(userData.createdAt).toLocaleDateString()
                                    : currentUser?.metadata?.creationTime
                                        ? new Date(currentUser.metadata.creationTime).toLocaleDateString()
                                        : 'N/A'
                                }
                            </span>
                        </div>
                    </div>
                    <p>‏</p>
                    <p>Note: This is a read-only view of your profile information. Ask Aadish if you want to modify your name/email. The uid and createdAt fields cannot be modified.</p>
                </div>
            </div>
        </div>
    );
};

export default Home;
