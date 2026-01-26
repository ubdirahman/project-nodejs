const mongoose = require('mongoose');

const customerSchema = mongoose.Schema({
    customer_name: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Customer', customerSchema);
