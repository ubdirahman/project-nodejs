const mongoose = require('mongoose');

const debtSchema = mongoose.Schema({
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    paidAmount: { type: Number, default: 0 },
    status: { type: String, enum: ['paid', 'unpaid'], default: 'unpaid' }
}, { timestamps: true });

module.exports = mongoose.model('Debt', debtSchema);
