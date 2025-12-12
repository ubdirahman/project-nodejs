const Product = require('../models/Product');

// @desc    Get all products
// @route   GET /api/products
// @access  Private
const getProducts = async (req, res) => {
    const products = await Product.find({});
    res.json(products);
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private
const createProduct = async (req, res) => {
    const { name, category, stock, price } = req.body;

    const product = new Product({
        name, category, stock, price
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private
const updateProduct = async (req, res) => {
    const { name, category, stock, price } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
        product.name = name;
        product.category = category;
        product.stock = stock;
        product.price = price;
        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private
const deleteProduct = async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
        await product.deleteOne();
        res.json({ message: 'Product removed' });
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
};

module.exports = { getProducts, createProduct, updateProduct, deleteProduct };
