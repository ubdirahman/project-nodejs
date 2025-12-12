const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    stock: { type: Number, required: true, default: 0 },
    price: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
