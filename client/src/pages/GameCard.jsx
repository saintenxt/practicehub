import React from 'react';
import { Link } from 'react-router-dom';
import './GameCard.css';

function GameCard({ game }) {
  const imagePath = require(`../photos/${game.image}`);

  return (
    <Link to={game.link} className="game-card-link">
      <div className="game-card">
        <img 
          src={imagePath} 
          alt={game.name} 
          className="game-image"
        />
      </div>
    </Link>
  );
}

export default GameCard;