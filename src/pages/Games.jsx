import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Games.css';

const Games = () => {
  const { currentUser } = useAuth();
  const [activeGame, setActiveGame] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  // Game library data
  const games = [
    {
      id: 'quiz',
      title: 'Quiz Game',
      description: 'Test your knowledge with this fun quiz game!',
      thumbnail: '🎮',
      url: `https://quiz.games.giishackathon2025.aadish.dev?uid=${currentUser?.uid || ''}`
    },
    {
      id: 'snake',
      title: 'Snake Game',
      description: 'Classic snake game to test your reflexes!',
      thumbnail: '🐍',
      url: `https://snake.games.giishackathon2025.aadish.dev?uid=${currentUser?.uid || ''}`
    },
  ];
  
  const openGame = (game) => {
    setIsLoading(true);
    setActiveGame(game);
  };
  
  const closeGame = () => {
    setIsLoading(false);
    setActiveGame(null);
  };

  const handleIFrameLoad = () => {
    // Keep loading screen for 1 second after iframe loads
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const handleBack = () => {
    navigate('/home');
  };
  
  return (
    <div className="games-container">
      <div className="games-content">
        <div className="games-header">
          <button onClick={handleBack} className="back-btn">
            ← Back
          </button>
          <h1>🎮 Games Library</h1>
          <p className="games-subtitle">Discover fun games and activities</p>
        </div>
        
        {/* Games grid */}
        {!activeGame && (
          <div className="games-grid">
            {games.map(game => (
              <div 
                key={game.id} 
                className="game-card"
                onClick={() => openGame(game)}
              >
                <div className="game-thumbnail">{game.thumbnail}</div>
                <h2>{game.title}</h2>
                <p>{game.description}</p>
                <button className="play-button">Play Now</button>
              </div>
            ))}
          </div>
        )}
        
        {/* Full screen game view */}
        {activeGame && (
          <div className="game-fullscreen">
            <div className="game-header">
              <h2>{activeGame.title}</h2>
              <button className="close-button" onClick={closeGame}>×</button>
            </div>
            <div className="game-frame-container fullscreen">
              {isLoading && (
                <div className="game-loading-screen">
                  <div className="loading-content">
                    <div className="loading-spinner">
                      <div className="spinner-circle"></div>
                      <div className="spinner-circle"></div>
                      <div className="spinner-circle"></div>
                    </div>
                    <h3 className="loading-title">Loading {activeGame.title}...</h3>
                    <p className="loading-subtitle">Preparing your gaming experience</p>
                    <div className="loading-bar">
                      <div className="loading-progress"></div>
                    </div>
                  </div>
                  <div className="loading-background">
                    <div className="floating-icon">🎮</div>
                    <div className="floating-icon">🎯</div>
                    <div className="floating-icon">⭐</div>
                    <div className="floating-icon">🎊</div>
                    <div className="floating-icon">🎉</div>
                  </div>
                </div>
              )}
              <iframe 
                src={activeGame.url}
                title={activeGame.title}
                className="game-frame"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                onLoad={handleIFrameLoad}
                style={{ opacity: isLoading ? 0 : 1 }}
              ></iframe>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Games;
