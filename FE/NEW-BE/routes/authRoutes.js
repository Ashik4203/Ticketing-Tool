const express = require('express');
const authController = require('../controllers/authController');
const { validateRequest } = require('../middleware/inputValidation');
const { authMiddleware, roleCheck } = require('../middleware/auth');
const router = express.Router();
router.post('/register', validateRequest('register'),authMiddleware, authController.register);
router.post('/login', validateRequest('login'), authController.login);
router.get('/rbac', authMiddleware, authController.rbac);

module.exports = router;