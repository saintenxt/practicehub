const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');
const { PORT } = require('./config/constants');
const routes = require('./routes'); 

const app = express();


app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://wahrwelt.ru',
  credentials: true
}));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use('/api', routes); 


const clientBuildPath = path.join(__dirname, '../client/build');
app.use(express.static(clientBuildPath));



app.get('/{*splat}', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  }
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});