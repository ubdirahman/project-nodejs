const express = require('express');
const router = express.Router();
const { getDebts, createDebt, updateDebtStatus, deleteDebt, updateDebt } = require('../controllers/debtController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getDebts)
    .post(protect, createDebt);

router.route('/:id')
    .put(protect, updateDebt)
    .delete(protect, deleteDebt);

// router.route('/:id/status').put(protect, updateDebtStatus); // Merged into general update or keep specific if needed.
// Keeping strictly to REST, PUT /:id usually replaces/updates resource. 

module.exports = router;
