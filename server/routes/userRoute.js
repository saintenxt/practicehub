const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController'); 
const { authenticateJWT } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/profile', authenticateJWT,userController.getProfile);
router.put('/profile', authenticateJWT, userController.updateProfile);
router.put('/change-password', authenticateJWT, userController.changePassword);

router.post('/avatar', authenticateJWT,upload, userController.uploadAvatar);
router.delete('/avatar', authenticateJWT, userController.deleteAvatar );


module.exports = router;
