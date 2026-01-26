const express = require('express');
const router = express.Router();
const { getCustomers, createCustomer, updateCustomer, deleteCustomer } = require('../controllers/customerController');
const { protect } = require('../middleware/authMiddleware');

const { validate, customerSchema } = require('../middleware/validation');

router.route('/')
    .get(protect, getCustomers)
    .post(protect, validate(customerSchema), createCustomer);

router.route('/:id')
    .put(protect, validate(customerSchema), updateCustomer)
    .delete(protect, deleteCustomer);

module.exports = router;
