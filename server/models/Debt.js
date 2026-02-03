const mongoose = require('mongoose'); // Library-ga MongoDB la hadla

// Qaabka deynta loo kaydinayo (Debt Schema)
const debtSchema = mongoose.Schema({
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true }, // Macmiilka deynta leh
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }, // Alaabta deynta lagu qaatay
    quantity: { type: Number, required: true }, // Tirada alaabta
    price: { type: Number, required: true }, // Qiimaha alaabta
    paidAmount: { type: Number, default: 0 }, // Inta hore loo bixiyey
    status: { type: String, enum: ['paid', 'unpaid'], default: 'unpaid' }, // Ma la bixiyey mise waa unpaid?
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } // Isticmaalaha qoray deyntan
}, { timestamps: true });

module.exports = mongoose.model('Debt', debtSchema);
