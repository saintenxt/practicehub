const bcrypt = require('bcrypt');
const UserModel = require('../models/usermod');
const fs = require('fs');
const path = require('path');
const { updateUser } = require('../models/usermod');


exports.getProfile = (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Не авторизован' });
  }

  const user = UserModel.findUserByID(req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'Пользователь не найден' });
  }
  const { password, ...safeUser } = user;
  res.json({ user: safeUser });
};

exports.updateProfile = async (req, res) => {
    const {username, email} = req.body;
    const userID = req.user.id;

    if (username) {
        const exsistingUser = UserModel.findUserByUsername(username);
        if (exsistingUser && exsistingUser.id !== userID){
            return res.status(400).json({error: 'Этот логин уже занят'});
        }
    }
        if (email) {
        const exsistingUser = UserModel.findUserByEmail(email);
        if (exsistingUser && exsistingUser.id !== userID){
            return res.status(400).json({error: 'Этот email уже занят'});
        }
    }

    const updatedUser = await UserModel.updateUser(userID, {username, email});
    if (!updatedUser) {
        return res.status(400).json({error: "Пользователь не найден"})
    }
    const {password, ...safeUser} = updatedUser;
    res.json({message: "Профиль обновлен", user: safeUser});
};

exports.changePassword = async (req, res) => {
    const {oldPassword, newPassword} = req.body;
    const user = UserModel.findUserByID(req.user.id);
    if (!oldPassword || !newPassword) {
        return res.status(400).json({ error: 'Введите старый и новый пароль' });
    }
    if (newPassword.length < 6) {
        return res.status(400).json({ error: 'Новый пароль должен быть минимум 6 символов' });
    }

  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) {
    return res.status(401).json({ error: 'Неверный старый пароль' });
  }

  await UserModel.updateUser(req.user.id, { password: newPassword });
  res.json({ message: 'Пароль успешно изменён' });
};


exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Файл не загружен' });
    }

    const userId = req.user.id;
    const user = UserModel.findUserByID(userId);
    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }


    if (user.avatar) {
      const oldPath = path.join(__dirname, '../uploads', user.avatar);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    const avatarFileName = req.file.filename;
    const updatedUser = await UserModel.updateUser(userId, { avatar: avatarFileName });

    if (!updatedUser) {
      return res.status(400).json({ error: 'Не удалось обновить профиль' });
    }

    const { password, ...safeUser } = updatedUser;
    res.json({ message: 'Аватар загружен', user: safeUser });
  } catch (err) {
    console.error('Ошибка загрузки аватара:', err);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
};


exports.deleteAvatar = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = UserModel.findUserByID(userId);
    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    if (!user.avatar) {
      return res.status(400).json({ error: 'Аватар не установлен' });
    }

    const oldPath = path.join(__dirname, '../uploads', user.avatar);
    if (fs.existsSync(oldPath)) {
      fs.unlinkSync(oldPath);
    }

    const updatedUser = await UserModel.updateUser(userId, { avatar: null });
    if (!updatedUser) {
      return res.status(400).json({ error: 'Не удалось удалить аватар' });
    }

    const { password, ...safeUser } = updatedUser;
    res.json({ message: 'Аватар удалён', user: safeUser });
  } catch (err) {
    console.error('Ошибка удаления аватара:', err);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
};

exports.deleteAvatar = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = UserModel.findUserByID(userId);
    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    if (!user.avatar) {
      return res.status(400).json({ error: 'Аватар не установлен' });
    }

    const oldPath = path.join(__dirname, '../uploads', user.avatar);
    if (fs.existsSync(oldPath)) {
      fs.unlinkSync(oldPath);
    }

    const updatedUser = await UserModel.updateUser(userId, { avatar: '../uploads/photo.png' });
    if (!updatedUser) {
      return res.status(400).json({ error: 'Не удалось удалить аватар' });
    }

    const { password, ...safeUser } = updatedUser;
    res.json({ message: 'Аватар удалён', user: safeUser });
  } catch (err) {
    console.error('Ошибка удаления аватара:', err);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
};