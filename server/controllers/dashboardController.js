const Product = require('../models/Product');
const Customer = require('../models/Customer');
const Sale = require('../models/Sale');
const Debt = require('../models/Debt');

const getUserDashboardStats = async (req, res) => {
    try {
        const totalProducts = await Product.countDocuments();

        const sales = await Sale.find();
        const totalSalesCount = sales.length;
        const totalSalesAmount = sales.reduce((acc, sale) => acc + sale.total, 0);

        const totalCustomers = await Customer.countDocuments();

        const debts = await Debt.find();
        const totalDebtCount = debts.length;
        const totalDebtAmount = debts.reduce((acc, debt) => acc + (debt.status === 'unpaid' ? debt.price * debt.quantity : 0), 0);

        res.json({
            totalProducts,
            totalSalesCount,
            totalSalesAmount,
            totalCustomers,
            totalDebtCount,
            totalDebtAmount
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getUserDashboardStats };
