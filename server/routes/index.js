const express = require('express');
const router = express.Router();

const authRoute = require('./authroute');
const userRoute = require('./userRoute');
const matchRoute = require('./matchroute');
router.use('/', authRoute);
router.use('/', userRoute);
router.use('/matches', matchRoute);
module.exports = router;