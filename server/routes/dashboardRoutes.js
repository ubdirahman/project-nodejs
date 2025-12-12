const express = require('express');
const router = express.Router();
const { getUserDashboardStats } = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getUserDashboardStats);

module.exports = router;
