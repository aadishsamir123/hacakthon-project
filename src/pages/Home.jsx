import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import LoadingScreen from '../components/LoadingScreen';
import { getLocationFromIP, getWeatherData, getWeatherIcon } from '../services/weatherService';
import { getSchoolNotices, getNoticesByPriority } from '../services/noticeService';
import { generateRandomStats, getRandomMotivationalQuote, getRandomFact, getRandomColor } from '../services/utilityService';
import './Home.css';

/**
 * Home Dashboard Component
 * 
 * Main landing page displayed after user authentication. This component serves as a 
 * comprehensive dashboard featuring:
 * - User authentication status and logout functionality
 * - Real-time weather widget with location-based data
 * - Live clock with current time and date
 * - Daily motivational content (jokes, facts, quotes, colors)
 * - School notice board with priority-based filtering
 * - Navigation to app features (games, AI chat, reporting system)
 * - Modal overlay for viewing all school notices
 * 
 * The dashboard is designed as a safe space for students with mental health
 * support features and engaging daily content.
 */
const Home = () => {
    // Authentication and navigation hooks
    const { currentUser, logout, getUserData } = useAuth();
    
    // State management for user data and loading states
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    
    // Weather-related state
    const [weather, setWeather] = useState(null);
    const [weatherLoading, setWeatherLoading] = useState(true);
    
    // Time display state (updates every second)
    const [currentTime, setCurrentTime] = useState(new Date());
    
    // Daily content state for motivational features
    const [stats, setStats] = useState(null);
    const [dailyColor, setDailyColor] = useState(null);
    const [dailyJoke, setDailyJoke] = useState('');
    const [dailyFact, setDailyFact] = useState('');
    const [dailyQuote, setDailyQuote] = useState('');
    
    // UI state for modal visibility
    const [showNoticesModal, setShowNoticesModal] = useState(false);
    
    const navigate = useNavigate();

    // Effect: Fetch user data on component mount and when auth state changes
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

    // Effect: Initialize daily motivational content on component mount
    // Generates random stats, color, joke, fact, and quote for the day
    useEffect(() => {
        setStats(generateRandomStats());
        setDailyColor(getRandomColor());
        setDailyJoke(getRandomJoke());
        setDailyFact(getRandomFact());
        setDailyQuote(getRandomMotivationalQuote());
    }, []);

    // Effect: Fetch weather data based on user's IP location
    // Includes fallback data in case of API failure
    useEffect(() => {
        const fetchWeather = async () => {
            try {
                // Get user location from IP address
                const location = await getLocationFromIP();
                // Fetch weather data for that location
                const weather = await getWeatherData(location);
                setWeather(weather);
            } catch (error) {
                console.error('Error fetching weather:', error);
                // Provide fallback weather data to ensure UI doesn't break
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

    // Effect: Set up live clock that updates every second
    // Creates an interval to refresh current time display
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        // Cleanup interval on component unmount to prevent memory leaks
        return () => clearInterval(timer);
    }, []);
    
    /**
     * Returns a random joke from a predefined collection
     * Used for daily entertainment and mood lifting for students
     * 
     * @returns {string} A random joke string
     */
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

    /**
     * Retrieves top 3 school notices (1 from each priority level)
     * Ensures balanced representation of high, medium, and low priority announcements
     * 
     * @returns {Array} Array containing up to 3 notice objects
     */
    const getTopNotices = () => {
        const highPriority = getNoticesByPriority('high').slice(0, 1);
        const mediumPriority = getNoticesByPriority('medium').slice(0, 1);
        const lowPriority = getNoticesByPriority('low').slice(0, 1);
        return [...highPriority, ...mediumPriority, ...lowPriority];
    }

    /**
     * Opens the modal overlay to display all school notices
     */
    const handleViewAllNotices = () => {
        setShowNoticesModal(true);
    }

    /**
     * Generates and sets a new random joke when user clicks refresh button
     */
    const handleNewJoke = () => {
        setDailyJoke(getRandomJoke());
    }

    /**
     * Formats a Date object into a readable time string (HH:MM:SS)
     * 
     * @param {Date} date - The date object to format
     * @returns {string} Formatted time string
     */
    const formatTime = (date) => {
        return date.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit' 
        });
    }

    /**
     * Formats a Date object into a readable date string (Weekday, Month Day, Year)
     * 
     * @param {Date} date - The date object to format
     * @returns {string} Formatted date string
     */
    const formatDate = (date) => {
        return date.toLocaleDateString([], { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    }

    /**
     * Handles user logout process
     * Logs out the current user and redirects to welcome page
     */
    const handleLogout = async () => {
        try {
            await logout();
            navigate('/welcome');
        } catch (error) {
            console.error('Failed to log out:', error);
        }
    };

    // Show loading screen while fetching user data
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
