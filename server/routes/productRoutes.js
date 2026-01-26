const express = require('express');
const router = express.Router();
const { getProducts, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');

const { validate, productSchema } = require('../middleware/validation');

router.route('/')
    .get(protect, getProducts)
    .post(protect, validate(productSchema), createProduct);

router.route('/:id')
    .put(protect, validate(productSchema), updateProduct)
    .delete(protect, deleteProduct);

module.exports = router;
