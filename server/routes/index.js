const express = require('express');
const router = express.Router();

const authRoute = require('./authroute');
const userRoute = require('./userRoute');
const matchRoute = require('./matchroute');
const messagesRoute = require('./messageRoute');

router.use('/', authRoute);
router.use('/', userRoute);
router.use('/matches', matchRoute);
router.use('/messages', messagesRoute);

module.exports = router;