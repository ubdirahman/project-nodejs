const Debt = require('../models/Debt');
const Product = require('../models/Product');

const getDebts = async (req, res) => {
    const debts = await Debt.find({})
        .populate('customer', 'customer_name phone')
        .populate('product', 'name');
    res.json(debts);
};

const createDebt = async (req, res) => {
    const { customer, product, quantity, price, status } = req.body;

    // Check product stock
    const productItem = await Product.findById(product);
    if (!productItem) {
        return res.status(404).json({ message: 'Product not found' });
    }

    if (productItem.stock < quantity) {
        return res.status(400).json({ message: 'Insufficient stock' });
    }

    const debt = new Debt({
        customer,
        product,
        quantity,
        price,
        status: status || 'unpaid'
    });

    const createdDebt = await debt.save();

    // Update Stock
    productItem.stock = productItem.stock - quantity;
    await productItem.save();

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
        // Restore stock
        const product = await Product.findById(debt.product);
        if (product) {
            product.stock += debt.quantity;
            await product.save();
        }

        await debt.deleteOne();
        res.json({ message: 'Debt removed' });
    } else {
        res.status(404).json({ message: 'Debt not found' });
    }
};

const updateDebt = async (req, res) => {
    const debt = await Debt.findById(req.params.id);
    if (debt) {
        // Handle stock update if quantity changes
        if (req.body.quantity && req.body.quantity !== debt.quantity) {
            const product = await Product.findById(debt.product);
            if (product) {
                const diff = req.body.quantity - debt.quantity;
                if (product.stock < diff) {
                    return res.status(400).json({ message: 'Insufficient stock for update' });
                }
                product.stock -= diff;
                await product.save();
                debt.quantity = req.body.quantity;
            }
        }

        debt.price = req.body.price || debt.price;
        debt.status = req.body.status || debt.status;

        if (req.body.amount) {
            debt.paidAmount = (debt.paidAmount || 0) + Number(req.body.amount);
        }

        const updatedDebt = await debt.save();
        res.json(updatedDebt);
    } else {
        res.status(404).json({ message: 'Debt not found' });
    }
};

module.exports = { getDebts, createDebt, updateDebtStatus, deleteDebt, updateDebt };
