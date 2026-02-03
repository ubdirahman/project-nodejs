const mongoose = require('mongoose'); // Library-ga MongoDB la hadla

// Qaabka iibka (Sale) loo kaydinayo
const saleSchema = mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }, // Alaabta la iibiyey
    quantity: { type: Number, required: true }, // Tirada la iibiyey
    price: { type: Number, required: true }, // Qiimaha lagu iibiyey
    total: { type: Number, required: true }, // Wadarta guud (Quantity * Price)
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } // Isticmaalaha iibka sameeyey
}, { timestamps: true });

module.exports = mongoose.model('Sale', saleSchema);
