const express = require('express');
const router = express.Router();
const { getAdminStats, getUsers, deleteUser } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/stats', protect, admin, getAdminStats);
router.get('/users', protect, admin, getUsers);
router.delete('/users/:id', protect, admin, deleteUser);

module.exports = router;
