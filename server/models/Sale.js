const mongoose = require('mongoose');

const saleSchema = mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    total: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Sale', saleSchema);
