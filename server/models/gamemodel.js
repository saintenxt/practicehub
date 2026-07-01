const fs = require('fs');
const { MATCHES_FILE } = require('../config/constants');

function readMatches() {
  try {
    const data = fs.readFileSync(MATCHES_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function writeMatches(matches) {
  fs.writeFileSync(MATCHES_FILE, JSON.stringify(matches, null, 2), 'utf-8');
}

function findMatchesByGame(game) {
  return readMatches().filter(m => m.game === game);
}

function findMatchById(id) {
  return readMatches().find(m => m.id === id);
}

function createMatch(userId, game, title, description, date, status = 'open') {
  const matches = readMatches();
  const newMatch = {
    id: Date.now().toString(),
    userId,
    game,
    title,
    description,
    date,
    status,
    players: []
  };
  matches.push(newMatch);
  writeMatches(matches);
  return newMatch;
}

function updateMatch(id, updates) {
  const matches = readMatches();
  const index = matches.findIndex(m => m.id === id);
  if (index === -1) return null;
  const match = matches[index];
  Object.assign(match, updates);
  writeMatches(matches);
  return match;
}

function deleteMatch(id) {
  const matches = readMatches();
  const filtered = matches.filter(m => m.id !== id);
  writeMatches(filtered);
  return true;
}

function getMatchesByUserId(id) {
  const matches = readMatches();
  return matches.filter(m => 
    String(m.userId) === String(userId || 
    (m.players && m.players.some(p => String(p) === String(userId)))
    ).sort((a, b) => new Date(a.date) - new Date(b.date)));
};

module.exports = {
  readMatches,
  writeMatches,
  findMatchesByGame,
  findMatchById,
  createMatch,
  updateMatch,
  deleteMatch,
  getMatchesByUserId
};