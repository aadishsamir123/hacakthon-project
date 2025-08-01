import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import LoadingScreen from '../components/LoadingScreen';
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
    
    const getRandomJoke = () => {
        const jokes = [
            "Do you want to hear a pizza joke? Nahhh, it's too cheesy!",
            "What did the buffalo say when his son left? Bison!",
            "What do you call a cold dog? A chilly dog.",
            "Where do you learn to make banana splits? At sundae school.",
            "What do you call a lion with no eyes? Lon",
            "What did one ocean say to the other? Nothing, they just waved.",
            "What did 20 do when it was hungry? Twenty-eight.",
            "Why are mountains so funny? They’re hill areas.",
            "Why wasn’t the cactus invited to hang out with the mushrooms? He wasn’t a fungi.",
            "Why shouldn’t you fundraise for marathons? They just take the money and run.",
            "Why can't a nose be 12 inches long? Because then it would be a foot.",
            "Why did the football coach yell at the vending machine? He wanted his quarter back!",
            "I had a joke about paper today, but it was tearable.",
            "What does a condiment wizard perform? Saucery"

        ];
        return jokes[Math.floor(Math.random() * jokes.length)];
    }

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/welcome');
        } catch (error) {
            console.error('Failed to log out:', error);
        }
    };

    if (loading) {
        return <LoadingScreen message="Loading your dashboard..." />;
    }

    return (
        <div className="home-container">
            <div className="home-content">
                <header className="home-header">
                    <h1>Welcome, {currentUser?.displayName || 'User'}</h1>
                    <button onClick={handleLogout} className="logout-btn">
                        Logout
                    </button>
                </header>
                
                <div className="dashboard-layout">
                    {/* Main Dashboard Content */}
                    <div className="main-dashboard">
                        <div className="fun-sentences">
                            <h2>🎭 Daily Joke</h2>
                            <p>{getRandomJoke()}</p>
                            <button 
                                onClick={() => window.location.reload()} 
                                className="refresh-joke-btn"
                            >
                                🎲 New Joke
                            </button>
                        </div>

                        <div className="dashboard-stats">
                            <div className="stat-card">
                                <div className="stat-icon">📊</div>
                                <div className="stat-content">
                                    <h3>Dashboard</h3>
                                    <p>Welcome to your personal space</p>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon">⚡</div>
                                <div className="stat-content">
                                    <h3>Quick Actions</h3>
                                    <p>Access reports and tools</p>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon">🎯</div>
                                <div className="stat-content">
                                    <h3>Goals</h3>
                                    <p>Track your progress</p>
                                </div>
                            </div>
                        </div>

                        <div className="fun-widgets">
                            <div className="widget">
                                <h3>🌟 Amazing Fact</h3>
                                <p>Did you know? A group of flamingos is called a "flamboyance"! How cool is that?</p>
                            </div>
                            <div className="widget">
                                <h3>� Today's Encouragement</h3>
                                <p>"You are braver than you believe, stronger than you seem, and smarter than you think!" - Winnie the Pooh</p>
                            </div>
                            <div className="widget">
                                <h3>🎨 Feeling Color</h3>
                                <div className="color-display">
                                    <div className="color-circle" style={{backgroundColor: '#ff69b4'}}></div>
                                    <span>Happy Pink</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="sidebar">
                        <div className="sidebar-section">
                            <h2>🌟 Safe Space Center</h2>
                            <p className="safe-space-note">This is your safe place to share thoughts and feelings</p>
                            <div className="sidebar-buttons">
                                <button 
                                    onClick={() => navigate('/user/report')} 
                                    className="sidebar-btn primary"
                                >
                                    <span className="btn-icon">�</span>
                                    Share My Thoughts
                                </button>
                                <button 
                                    onClick={() => navigate('/user/reports')} 
                                    className="sidebar-btn secondary"
                                >
                                    <span className="btn-icon">🤝</span>
                                    Help Others
                                </button>
                            </div>
                        </div>

                        <div className="sidebar-section">
                            <h3>🎈 Fun Activities</h3>
                            <div className="tool-list">
                                <div className="tool-item">
                                    <span className="tool-icon">🎨</span>
                                    <span>Creative Corner</span>
                                </div>
                                <div className="tool-item">
                                    <span className="tool-icon">�</span>
                                    <span>Story Time</span>
                                </div>
                                <div className="tool-item">
                                    <span className="tool-icon">🎵</span>
                                    <span>Music & Games</span>
                                </div>
                            </div>
                        </div>

                        <div className="sidebar-section">
                            <h3>� Daily Positivity</h3>
                            <div className="fun-activity">
                                <p>� You are awesome!</p>
                                <p>🦋 Today's magic number: {Math.floor(Math.random() * 100) + 1}</p>
                                <p>💝 Kindness level: {'❤️'.repeat(Math.floor(Math.random() * 5) + 1)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
