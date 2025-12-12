const Customer = require('../models/Customer');

const getCustomers = async (req, res) => {
    const customers = await Customer.find({});
    res.json(customers);
};

const createCustomer = async (req, res) => {
    const { customer_name, phone, address } = req.body;
    const customer = new Customer({ customer_name, phone, address });
    const createdCustomer = await customer.save();
    res.status(201).json(createdCustomer);
};

const updateCustomer = async (req, res) => {
    const { customer_name, phone, address } = req.body;
    const customer = await Customer.findById(req.params.id);
    if (customer) {
        customer.customer_name = customer_name;
        customer.phone = phone;
        customer.address = address;
        const updatedCustomer = await customer.save();
        res.json(updatedCustomer);
    } else {
        res.status(404).json({ message: 'Customer not found' });
    }
};

const deleteCustomer = async (req, res) => {
    const customer = await Customer.findById(req.params.id);
    if (customer) {
        await customer.deleteOne();
        res.json({ message: 'Customer removed' });
    } else {
        res.status(404).json({ message: 'Customer not found' });
    }
};

module.exports = { getCustomers, createCustomer, updateCustomer, deleteCustomer };
