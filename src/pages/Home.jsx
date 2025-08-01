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
    
    const getRandomJoke = () => {
        const jokes = [
            "Do you want to hear a pizza joke? Nahhh, it's too cheesy!",
            "What did the buffalo say when his son left? Bison!",
            "What do you call a cold dog? A chilly dog.",
            "Where do you learn to make banana splits? At sundae school.",
            "What do you call a lion with no eyes? Lon",
            "What did one ocean say to the other? Nothing, they just waved."
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
                    <h1>Welcome, {currentUser?.displayName || 'User'}</h1>
                    <button onClick={handleLogout} className="logout-btn">
                        Logout
                    </button>
                </header>
                <div className="fun-sentences">
                    <h2>A randomized joke for you:</h2>
                    <p>{getRandomJoke()}</p>
                </div>
            </div>
        </div>
    );
};

export default Home;
