const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { SECRET_KEY } = require('../config/constants');
const UserModel = require('../models/usermod');

exports.register = async (req, res) => {
  const { username, password, email } = req.body;
  if (!username || !password || !email) {
    return res.status(400).json({ error: 'Все поля обязательны' });
  }

  if (UserModel.findUserByUsername(username)) {
    return res.status(400).json({ error: 'Логин уже занят' });
  }
  if (UserModel.findUserByEmail(email)) {
    return res.status(400).json({ error: 'Email уже используется' });
  }

  const newUser = await UserModel.createUser(username, email, password);
  res.status(201).json({ message: 'Регистрация успешна' });
}

exports.login= async (req, res) => {
  const { username, password, email} = req.body;
  const login = username || email;

  if (!login || !password) {
    return res.status(401).json({error: 'Введите логин или пароль'});
  };
  let user = UserModel.findUserByUsername(login);
  if (!user) user = UserModel.findUserByEmail(login);

  if (!user) {
    return res.status(401).json({error: 'Неверный логин или пароль'})
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ error: 'Неверный логин или пароль' });
  };

  const payload = { username: user.username, role: user.role, id: user.id };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '6h' });
  res.cookie('auth_token', token, {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    maxAge: 360000000
  });
  res.json({ message: 'Успешный вход', user: payload });
}

exports.logout = (req, res) => {
  res.clearCookie('auth_token');
  res.json({ message: 'Вы вышли' });
}

exports.getMe = (req, res) => {
  res.json({ user: req.user });
}
