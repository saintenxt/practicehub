import React from 'react';
import './Hero.css';
import GameCard from './GameCard';

const games = [
  { id: 1, name: 'Valorant', image: 'valorant2.png', link: '/matches/valorant' },
  { id: 2, name: 'CS2', image: 'cs2.jpg', link: '/matches/cs2' },
  { id: 3, name: 'Brawl Stars', image: 'brawl.jpg', link: '/matches/brawlstars' },
  { id: 4, name: 'League of Legends', image: 'lol.jpg', link: '/matches/leagueoflegends' },
  { id: 5, name: 'Warface', image: 'warface.jpg', link: '/matches/warface' },
  { id: 6, name: 'Deadlock', image: 'deadlock.jpg', link: '/matches/deadlock' },
  { id: 7, name: 'Rainbow Six', image: 'rainbow.jpg', link: '/matches/rainbowsix' },
  { id: 8, name: 'Rocket League', image: 'rl.jpg', link: '/matches/rocketleague' },
];

function Hero() {
  return (
    <section className="hero">
      <div className="hero_container">
        <div className="hero_games">
          <div className="games-grid">
            {games.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;