const matchModel = require('../models/gamemodel');
const UserModel = require('../models/usermod');

exports.getMatchesByGame = (req, res) => {
  const { game } = req.params;
  const matches = matchModel.findMatchesByGame(game);
  
  const enriched = matches.map(match => {
    const user = UserModel.findUserByID(match.userId);
    return {
      ...match,
      author: user ? user.username : 'unknown'
    };
  });
  
  res.json({ matches: enriched });
};


exports.createMatch = (req, res) => {
  const { game, title, description, date, status } = req.body;
  if (!game || !title || !description || !date) {
    return res.status(400).json({ error: 'Все поля обязательны' });
  }
  const matchDate = new Date(date);
  const now = new Date();
  const maxDate = new Date(now.getFullYear()+1, now.getMonth(), now.getDate());

  if (isNaN(matchDate)) {
    return res.status(400).json({error: 'Неправильный ввод данны'});
  };

  if (matchDate > now) {
    return res.status(400).json({error: 'Дата должна быть актуальной'});
  };

  if (matchDate > maxDate) {
    return res.status(400).json({error: 'Дата должна быть не позднее чем через год'});
  };

  const userId = req.user.id;
  const newMatch = matchModel.createMatch(userId, game, title, description, date, status || 'open');
  

  const user = UserModel.findUserByID(userId);
  res.status(201).json({
    match: {
      ...newMatch,
      author: user ? user.username : 'unknown'
    }
  });
};

exports.updateMatchStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (!status) {
    return res.status(400).json({ error: 'Статус обязателен' });
  }
  const updated = matchModel.updateMatchStatus(id, status);
  if (!updated) {
    return res.status(404).json({ error: 'Объявление не найдено' });
  }
  res.json({ match: updated });
};


exports.joinMatch = (req, res) => {
  const { id } = req.params;
  const userID = req.user.id;

  const match = matchModel.findMatchById(id);
  if (!match) {
    res.status(404).json({error: 'Объявление не найден'})
  }

  if (match.userId === userID) {
    return res.status(400).json({ error: 'Вы не можете записаться на своё объявление' });
  }

  if (!match.players) match.players = [];

  if (match.players.includes(userID)) {
    return res.status(400).json({ error: 'Вы уже записаны' });
  }

  match.players.push(userID);
  const updated = matchModel.updateMatch(id, { players: match.players });
  res.json({ match: updated });
}

exports.leaveMatch = (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const match = matchModel.findMatchById(id);
  if (!match) {
    return res.status(404).json({ error: 'Объявление не найдено' });
  }

  if (!match.players) match.players = [];

  if (!match.players.includes(userId)) {
    return res.status(400).json({ error: 'Вы не записаны' });
  }

  match.players = match.players.filter(uid => uid !== userId);
  const updated = matchModel.updateMatch(id, { players: match.players });
  res.json({ match: updated });
};


exports.updateMatchStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (!status) {
    return res.status(400).json({ error: 'Статус обязателен' });
  }
  const updated = matchModel.updateMatch(id, { status });
  if (!updated) {
    return res.status(404).json({ error: 'Объявление не найдено' });
  }
  res.json({ match: updated });
};


exports.deleteMatch = (req, res) => {
  const { id } = req.params;
  const match = matchModel.findMatchById(id);
  if (!match) {
    return res.status(404).json({ error: 'Объявление не найдено' });
  }
  if (match.userId !== req.user.id) {
    return res.status(403).json({ error: 'Вы не автор объявления' });
  }
  matchModel.deleteMatch(id);
  res.json({ message: 'Объявление удалено' });
};

exports.getMyMatches = (req, res) => {
  const { id } = req.user.id;
  const matches = matchModel.getMatchesByUserId(id);

  const usermatches = matches.map(m => {
    const user = UserModel.findUserByID(match.id);
    return {
      ...m,
      author: user ? user.username : 'unknown'
    };
  });
};