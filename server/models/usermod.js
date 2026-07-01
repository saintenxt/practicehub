const fs = require('fs');
const bcrypt = require('bcrypt');
const { USER_FILES } = require('../config/constants');
const { json } = require('stream/consumers');


function read_users() {
  const data = fs.readFileSync(USER_FILES, 'utf-8');
  return JSON.parse(data);
}

function write_users(users) {
  fs.writeFileSync(USER_FILES, JSON.stringify(users, null, 2), 'utf-8');
}

function findUserByUsername(username) {
  return read_users().find(u => u.username === username);
}

function findUserByEmail(email) {
  return read_users().find(u => u.email ===email);
}

function findUserByID(id) {
  const users = read_users();
  return users.find(user => String(user.id) === String(id));
}

async function createUser(username, email, password) {
    const users = read_users();
    const hashedPassword = await bcrypt.hash(password, 10);
    const new_user = {
        id: Date.now().toString(),
        username,
        password: hashedPassword,
        email,
        role: 'user',
        avatar: '../uploads/photo.png' 
    };
    users.push(new_user);
    write_users(users);
    return new_user;
}


async function updateUser(id, updates) {
  const users = read_users();
  const index = users.findIndex(u => u.id === id);
  if (index === -1) return null;
  const user = users[index];
  if (updates.username) user.username = updates.username;
  if (updates.email) user.email = updates.email;
  if (updates.password) 
    user.password = await bcrypt.hash(updates.password, 10);
  if (updates.avatar !== undefined){
    user.avatar = updates.avatar;
  }

  users[index] = user;
  write_users(users);
  return user;
}

module.exports = {
    read_users,
    write_users,
    findUserByUsername,
    findUserByEmail,
    createUser,
    findUserByID,
    updateUser
}