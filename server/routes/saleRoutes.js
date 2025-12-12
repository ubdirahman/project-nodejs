const express = require('express');
const router = express.Router();
const { getSales, createSale, deleteSale, updateSale } = require('../controllers/saleController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getSales)
    .post(protect, createSale);

router.route('/:id')
    .delete(protect, deleteSale)
    .put(protect, updateSale);

module.exports = router;
