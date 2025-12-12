const Debt = require('../models/Debt');

const getDebts = async (req, res) => {
    const debts = await Debt.find({})
        .populate('customer', 'customer_name phone')
        .populate('product', 'name');
    res.json(debts);
};

const createDebt = async (req, res) => {
    const { customer, product, quantity, price, status } = req.body;

    const debt = new Debt({
        customer,
        product,
        quantity,
        price,
        status: status || 'unpaid'
    });

    const createdDebt = await debt.save();
    res.status(201).json(createdDebt);
};

const updateDebtStatus = async (req, res) => {
    const { status } = req.body; // paid or unpaid
    const debt = await Debt.findById(req.params.id);

    if (debt) {
        debt.status = status;
        const updatedDebt = await debt.save();
        res.json(updatedDebt);
    } else {
        res.status(404).json({ message: 'Debt not found' });
    }
};

module.exports = { getDebts, createDebt, updateDebtStatus };

const deleteDebt = async (req, res) => {
    const debt = await Debt.findById(req.params.id);
    if (debt) {
        await debt.deleteOne();
        res.json({ message: 'Debt removed' });
    } else {
        res.status(404).json({ message: 'Debt not found' });
    }
};

const updateDebt = async (req, res) => {
    const debt = await Debt.findById(req.params.id);
    if (debt) {
        debt.quantity = req.body.quantity || debt.quantity;
        debt.price = req.body.price || debt.price;
        debt.status = req.body.status || debt.status;

        const updatedDebt = await debt.save();
        res.json(updatedDebt);
    } else {
        res.status(404).json({ message: 'Debt not found' });
    }
};

module.exports = { getDebts, createDebt, updateDebtStatus, deleteDebt, updateDebt };
