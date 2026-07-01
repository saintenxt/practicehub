const express = require('express');
const router = express.Router();
const matchController = require('../controllers/matchcontroller'); 
const { authenticateJWT } = require('../middleware/auth');


router.get('/:game', matchController.getMatchesByGame);
router.post('/',authenticateJWT, matchController.createMatch);
router.patch('/:id/status', authenticateJWT, matchController.updateMatchStatus);
router.delete('/:id',authenticateJWT, matchController.deleteMatch);
router.post('/:id/join', authenticateJWT, matchController.joinMatch);
router.post('/:id/leave', authenticateJWT, matchController.leaveMatch);


module.exports = router;