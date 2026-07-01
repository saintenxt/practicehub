const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const { authenticateJWT } = require('../middleware/auth');

router.post('/', authenticateJWT, messageController.sendMessage);
router.get('/', authenticateJWT, messageController.getConversationList);
router.get('/:userId', authenticateJWT, messageController.getConversation);
router.patch('/', authenticateJWT, messageController.markAsRead);

module.exports = router;
