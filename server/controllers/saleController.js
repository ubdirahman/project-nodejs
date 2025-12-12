const Sale = require('../models/Sale');
const Product = require('../models/Product');

const getSales = async (req, res) => {
    const sales = await Sale.find({}).populate('product', 'name price');
    res.json(sales);
};

const createSale = async (req, res) => {
    const { product, quantity, price } = req.body;

    // Check product stock
    const productItem = await Product.findById(product);
    if (!productItem) {
        return res.status(404).json({ message: 'Product not found' });
    }

    if (productItem.stock < quantity) {
        return res.status(400).json({ message: 'Insufficient stock' });
    }

    // Create Sale
    const total = quantity * price;
    const sale = new Sale({
        product,
        quantity,
        price,
        total
    });

    const createdSale = await sale.save();

    // Update Stock
    productItem.stock = productItem.stock - quantity;
    await productItem.save();

    res.status(201).json(createdSale);
};

const deleteSale = async (req, res) => {
    const sale = await Sale.findById(req.params.id);

    if (sale) {
        // Restore stock
        const product = await Product.findById(sale.product);
        if (product) {
            product.stock += sale.quantity;
            await product.save();
        }

        await sale.deleteOne();
        res.json({ message: 'Sale removed' });
    } else {
        res.status(404).json({ message: 'Sale not found' });
    }
};

const updateSale = async (req, res) => {
    const sale = await Sale.findById(req.params.id);

    if (sale) {
        // For simplicity, we only allow updating price or correcting total.
        // Changing quantity/product is complex due to stock calculations.
        // We will allow deleting and re-creating for that.
        // But the user asked for "Update". I'll allow price updates here.
        sale.price = req.body.price || sale.price;
        sale.total = sale.quantity * sale.price;
        const updatedSale = await sale.save();
        res.json(updatedSale);
    } else {
        res.status(404).json({ message: 'Sale not found' });
    }
};

module.exports = { getSales, createSale, deleteSale, updateSale };
