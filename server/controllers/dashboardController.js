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

        // Chart Data: Sales by Date
        const salesByDate = await Sale.aggregate([
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    total: { $sum: "$total" }
                }
            },
            { $sort: { _id: 1 } } // Sort by date ascending
        ]);

        const formattedSalesByDate = salesByDate.map(item => ({
            date: item._id,
            total: item.total
        }));

        const totalCustomers = await Customer.countDocuments();

        const debts = await Debt.find();
        const totalDebtCount = debts.length;

        // Detailed Debt Calculations
        const totalDebtInitial = debts.reduce((acc, d) => acc + (d.price * d.quantity), 0);
        const totalPaidFromDebts = debts.reduce((acc, d) => acc + (d.paidAmount || 0), 0);
        const totalPendingDebt = totalDebtInitial - totalPaidFromDebts;

        // Total Paid (Cash Sales + Partial/Full Debt Payments)
        const totalSystemPaid = totalSalesAmount + totalPaidFromDebts;

        // Chart Data: Products by Category
        const productsByCategory = await Product.aggregate([
            {
                $group: {
                    _id: "$category",
                    count: { $sum: 1 }
                }
            }
        ]);

        const formattedProductsByCategory = productsByCategory.map(item => ({
            name: item._id,
            value: item.count
        }));

        res.json({
            totalProducts,
            totalSalesCount,
            totalSalesAmount,
            totalCustomers,
            totalDebtCount,
            totalDebtAmount: totalPendingDebt, // Show pending debt as "Total Debt"
            totalPaidAmount: totalSystemPaid,
            totalPendingDebt: totalPendingDebt,
            salesByDate: formattedSalesByDate,
            productsByCategory: formattedProductsByCategory
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getUserDashboardStats };
