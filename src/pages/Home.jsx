import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import LoadingScreen from '../components/LoadingScreen';
import { getLocationFromIP, getWeatherData, getWeatherIcon } from '../services/weatherService';
import { getSchoolNotices, getNoticesByPriority } from '../services/noticeService';
import { generateRandomStats, getRandomMotivationalQuote, getRandomFact, getRandomColor } from '../services/utilityService';
import './Home.css';

const Home = () => {
    const { currentUser, logout, getUserData } = useAuth();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [weather, setWeather] = useState(null);
    const [weatherLoading, setWeatherLoading] = useState(true);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [stats, setStats] = useState(null);
    const [dailyColor, setDailyColor] = useState(null);
    const [showNoticesModal, setShowNoticesModal] = useState(false);
    const [dailyJoke, setDailyJoke] = useState('');
    const [dailyFact, setDailyFact] = useState('');
    const [dailyQuote, setDailyQuote] = useState('');
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

    // Generate daily stats and color on component mount
    useEffect(() => {
        setStats(generateRandomStats());
        setDailyColor(getRandomColor());
        setDailyJoke(getRandomJoke());
        setDailyFact(getRandomFact());
        setDailyQuote(getRandomMotivationalQuote());
    }, []);

    // Weather API integration
    useEffect(() => {
        const fetchWeather = async () => {
            try {
                const location = await getLocationFromIP();
                const weather = await getWeatherData(location);
                setWeather(weather);
            } catch (error) {
                console.error('Error fetching weather:', error);
                // Set fallback weather data
                setWeather({
                    city: 'Your City',
                    country: 'Your Country',
                    temperature: 22,
                    description: 'partly cloudy',
                    humidity: 65,
                    windSpeed: 5
                });
            }
            setWeatherLoading(false);
        };

        fetchWeather();
    }, []);

    // Live clock
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);
    
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

    const getTopNotices = () => {
        const highPriority = getNoticesByPriority('high').slice(0, 1);
        const mediumPriority = getNoticesByPriority('medium').slice(0, 1);
        const lowPriority = getNoticesByPriority('low').slice(0, 1);
        return [...highPriority, ...mediumPriority, ...lowPriority];
    }

    const handleViewAllNotices = () => {
        setShowNoticesModal(true);
    }

    const handleNewJoke = () => {
        setDailyJoke(getRandomJoke());
    }

    const formatTime = (date) => {
        return date.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit' 
        });
    }

    const formatDate = (date) => {
        return date.toLocaleDateString([], { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
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
                        {/* Daily Joke - moved to top */}
                        <div className="fun-sentences">
                            <h2>🎭 Daily Joke</h2>
                            <p>{dailyJoke}</p>
                            <button 
                                onClick={handleNewJoke} 
                                className="refresh-joke-btn"
                            >
                                🎲 New Joke
                            </button>
                        </div>

                        {/* Live Clock and Date */}
                        <div className="clock-widget">
                            <div className="time-display">
                                <h2>🕐 {formatTime(currentTime)}</h2>
                                <p>{formatDate(currentTime)}</p>
                            </div>
                        </div>

                        {/* Weather Widget */}
                        <div className="weather-widget">
                            <h3>🌤️ Weather</h3>
                            {weatherLoading ? (
                                <p>Loading weather...</p>
                            ) : weather ? (
                                <div className="weather-info">
                                    <div className="weather-main">
                                        <span className="weather-icon">{getWeatherIcon(weather.description)}</span>
                                        <span className="temperature">{weather.temperature}°C</span>
                                    </div>
                                    <p className="weather-location">{weather.city}, {weather.country}</p>
                                    <p className="weather-description">{weather.description}</p>
                                    <div className="weather-details">
                                        <span>💧 {weather.humidity}%</span>
                                        <span>💨 {weather.windSpeed} m/s</span>
                                    </div>
                                </div>
                            ) : (
                                <p>Weather unavailable</p>
                            )}
                        </div>

                        {/* School Notice Board */}
                        <div className="notice-board">
                            <h3>📢 School Notice Board</h3>
                            <div className="notices-container">
                                {getTopNotices().map((notice) => (
                                    <div key={notice.id} className={`notice-item priority-${notice.priority}`}>
                                        <h4>{notice.title}</h4>
                                        <p>{notice.content}</p>
                                        <small>{new Date(notice.date).toLocaleDateString()}</small>
                                    </div>
                                ))}
                            </div>
                            <button className="view-all-notices" onClick={handleViewAllNotices}>View All Notices</button>
                        </div>

                        {/* Fun Widgets */}
                        <div className="fun-widgets">
                            <div className="widget">
                                <h3>🌟 Amazing Fact</h3>
                                <p>{dailyFact}</p>
                            </div>
                            <div className="widget">
                                <h3>💪 Today's Encouragement</h3>
                                <p>"{dailyQuote}"</p>
                            </div>
                            <div className="widget">
                                <h3>🎨 Feeling Color</h3>
                                <div className="color-display">
                                    <div className="color-circle" style={{backgroundColor: dailyColor?.color || '#ff69b4'}}></div>
                                    <span>{dailyColor?.name || 'Happy Pink'}</span>
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
                                <div className="tool-item" onClick={() => navigate('/games')}>
                                    <span className="tool-icon">🎮</span>
                                    <span>Games</span>
                                </div>
                                <div className="tool-item" onClick={() => navigate('/chat')}>
                                    <span className="tool-icon">🤖</span>
                                    <span>AI Support Chat</span>
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

                {/* Notices Modal */}
                {showNoticesModal && (
                    <div className="modal-overlay" onClick={() => setShowNoticesModal(false)}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h2>📢 All School Notices</h2>
                                <button 
                                    className="modal-close" 
                                    onClick={() => setShowNoticesModal(false)}
                                >
                                    ✕
                                </button>
                            </div>
                            <div className="modal-body">
                                {getSchoolNotices().map((notice) => (
                                    <div key={notice.id} className={`notice-item-modal priority-${notice.priority}`}>
                                        <h4>{notice.title}</h4>
                                        <p>{notice.content}</p>
                                        <div className="notice-meta">
                                            <small>📅 {new Date(notice.date).toLocaleDateString()}</small>
                                            {notice.author && <small>👤 {notice.author}</small>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
