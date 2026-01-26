const express = require('express');
const router = express.Router();
const { getAdminStats, getUsers, deleteUser, toggleUserBlock, updateUserPassword } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/stats', protect, admin, getAdminStats);
router.get('/users', protect, admin, getUsers);
router.delete('/users/:id', protect, admin, deleteUser);
router.put('/users/:id/block', protect, admin, toggleUserBlock);
router.put('/users/:id/password', protect, admin, updateUserPassword);

module.exports = router;
