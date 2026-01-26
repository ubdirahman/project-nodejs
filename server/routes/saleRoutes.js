const express = require('express');
const router = express.Router();
const { getSales, createSale, deleteSale, updateSale } = require('../controllers/saleController');
const { protect } = require('../middleware/authMiddleware');

const { validate, saleSchema } = require('../middleware/validation');

router.route('/')
    .get(protect, getSales)
    .post(protect, validate(saleSchema), createSale);

router.route('/:id')
    .delete(protect, deleteSale)
    .put(protect, validate(saleSchema), updateSale);

module.exports = router;
