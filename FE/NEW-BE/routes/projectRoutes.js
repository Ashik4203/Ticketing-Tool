const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const { authMiddleware, roleCheck } = require('../middleware/auth');
router.use(authMiddleware);
router.post('/', projectController.create);
router.get('/', projectController.getAll);
router.get('/:id', projectController.getOne);
router.put('/:id', projectController.update);
router.delete('/:id', projectController.delete);

module.exports = router;
