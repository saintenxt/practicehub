const path = require('path');

module.exports = {
  PORT: 3000,
  SECRET_KEY: 'ваш-супер-секретный-ключ',
  USER_FILES: path.join(__dirname, '../userdata.json'),
  MATCHES_FILE: path.join(__dirname, '../matches.json')   // <-- ЭТА СТРОКА ДОЛЖНА БЫТЬ
};