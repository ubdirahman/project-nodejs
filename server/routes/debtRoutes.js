const express = require('express');
const router = express.Router();
const { getDebts, createDebt, updateDebtStatus, deleteDebt, updateDebt } = require('../controllers/debtController');
const { protect } = require('../middleware/authMiddleware');

const { validate, debtSchema, debtUpdateSchema } = require('../middleware/validation');

router.route('/')
    .get(protect, getDebts)
    .post(protect, validate(debtSchema), createDebt);

router.route('/:id')
    .put(protect, validate(debtUpdateSchema), updateDebt)
    .delete(protect, deleteDebt);

// router.route('/:id/status').put(protect, updateDebtStatus); // Merged into general update or keep specific if needed.
// Keeping strictly to REST, PUT /:id usually replaces/updates resource. 

module.exports = router;
