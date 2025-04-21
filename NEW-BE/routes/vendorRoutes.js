const express = require('express');
const router = express.Router();
const vendorController = require('../controllers/vendorController');
const { authMiddleware, roleCheck } = require('../middleware/auth');
router.use(authMiddleware);
router.post('/', vendorController.create);
router.get('/', vendorController.getAll);
router.get('/:id', vendorController.getOne);
router.put('/:id', vendorController.update);
router.delete('/:id', vendorController.delete);

module.exports = router;
