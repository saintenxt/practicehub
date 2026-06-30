// src/config/gameData.js

import ValorantBg from './photos/valorant3.jpg'; 
import Cs2Bg from './photos/cs21.jpg';
import BrawlBg from './photos/brawl5.jpg';
import LolBg from './photos/lol4.jpg';
import WarfaceBg from './photos/warface2.jpg';
import DeadlockBg from './photos/deadlock1.jpg';
import RainbowBg from './photos/rainbow61.jpg';
import RocketBg from './photos/rl3.jpg';

export const gameData = {
  valorant: {
    title: 'VALORANT',
    description: 'Valorant — это динамичный тактический шутер, где молниеносная стрельба переплетается с уникальными способностями агентов, превращая каждый раунд в захватывающее противостояние умов и реакции.',
    backgroundImage: ValorantBg,
  },
  cs2: {
    title: 'Counter-Strike 2',
    description: 'Counter-Strike 2 — это командный тактический шутер, где две команды соревнуются в режимах «Захват заложника» и «Уничтожение бомбы». Оригинальный геймплей, проверенный годами, теперь на новом движке.',
    backgroundImage: Cs2Bg,
  },
  brawlstars: {
    title: 'Brawl Stars',
    description: 'Brawl Stars — это динамичная мобильная игра, где вы сражаетесь в командах по 3 человека в различных режимах: захват кристаллов, зона контроля, вышибалы и другие.',
    backgroundImage: BrawlBg,
  },
  leagueoflegends: {
    title: 'League of Legends',
    description: 'League of Legends — легендарная MOBA, где две команды по 5 игроков сражаются на карте Summoner’s Rift, уничтожая башни и пытаясь разрушить вражеский нексус.',
    backgroundImage: LolBg,
  },
  warface: {
    title: 'Warface',
    description: 'Warface — бесплатный онлайн-шутер с реалистичной графикой, множеством режимов и классов. Сражайтесь в кооперативных миссиях и PvP-режимах.',
    backgroundImage: WarfaceBg,
  },
  deadlock: {
    title: 'Deadlock',
    description: 'Deadlock — это научно-фантастический шутер с элементами MOBA, где вы управляете героями с уникальными способностями и сражаетесь за контроль над картой.',
    backgroundImage: DeadlockBg,
  },
  rainbowsix: {
    title: 'Rainbow Six Siege',
    description: 'Rainbow Six Siege — тактический шутер, где каждая стена может быть разрушена, а каждый раунд — это уникальная головоломка. Играйте за спецназовцев и планируйте свои действия.',
    backgroundImage: RainbowBg,
  },
  rocketleague: {
    title: 'Rocket League',
    description: 'Rocket League — это футбол на реактивных автомобилях. Управляйте машиной, забивайте голы и выполняйте невероятные трюки в этом аркадном спортивном симуляторе.',
    backgroundImage: RocketBg,
  },
};
