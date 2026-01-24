const Product = require('../models/Product');
const Store = require('../models/Store');

exports.createProduct = async (req, res) => {
    try {
        const { product_name, description, price, stock, weight, category } = req.body;

        const store = await Store.findOne({ user_id: req.user.id });
        if (!store) {
            return res.status(404).json({ message: "Store not found. Please create a store first." });
        }
        const newProduct = new Product({
            store_id: store._id,
            product_name,
            description,
            price,
            stock,
            weight,
            category,
            product_image: req.file ? `/uploads/products/${req.file.filename}` : ""
        });

        await newProduct.save();
        res.status(201).json({ 
            message: "Product added successfully!", 
            product: newProduct 
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find()
            .populate('store_id', 'store_name store_image')
            .populate('category', 'category_name');
            
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate('store_id', 'store_name store_address')
            .populate('category', 'category_name');

        if (!product) return res.status(404).json({ message: "Product not found" });
        res.json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.updateProduct = async (req, res) => {
    try {
        const { product_name, description, price, stock, weight, category } = req.body;
        
        const store = await Store.findOne({ user_id: req.user.id });
        if (!store) return res.status(404).json({ message: "Store not found" });

        let product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });

        if (product.store_id.toString() !== store._id.toString()) {
            return res.status(403).json({ message: "Unauthorized: You don't own this product" });
        }

        const updateData = {
            product_name,
            description,
            price,
            stock,
            weight,
            category
        };

        if (req.file) {
            updateData.product_image = `/uploads/products/${req.file.filename}`;
        }

        product = await Product.findByIdAndUpdate(
            req.params.id, 
            { $set: updateData }, 
            { new: true }
        );

        res.json({ message: "Product updated successfully", product });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });
        if (req.user.role !== 'admin') {
            const store = await Store.findOne({ user_id: req.user.id });
            if (!store || product.store_id.toString() !== store._id.toString()) {
                return res.status(403).json({ message: "Unauthorized to delete this product" });
            }
        }

        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: "Product deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};