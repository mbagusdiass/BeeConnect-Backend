const Store = require('../models/Store');
const User = require('../models/User');
const Product = require('../models/Product');
const TransactionDetail = require('../models/TransactionDetail');

exports.createStore = async (req, res) => {
    try {
        const { store_name, store_description, store_address } = req.body;

        const existingStore = await Store.findOne({ user_id: req.user.id });
        if (existingStore) {
            return res.status(400).json({ message: "You already have a store" });
        }
        const newStore = new Store({
            user_id: req.user.id,
            store_name,
            store_description,
            store_address
        });

        await newStore.save();

        await User.findByIdAndUpdate(req.user.id, { role: 'seller' });

        res.status(201).json({
            message: "Store created successfully. You are now a Seller!",
            store: newStore
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateStore = async (req, res) => {
    try {
        const { store_name, store_description, store_address, is_active } = req.body;
        
        const store = await Store.findOneAndUpdate(
            { user_id: req.user.id },
            { 
                $set: { 
                    store_name, 
                    store_description, 
                    store_address, 
                    is_active 
                } 
            },
            { new: true }
        );

        if (!store) {
            return res.status(404).json({ message: "Store not found. Please create a store first." });
        }

        res.json({ 
            message: "Store updated successfully", 
            store 
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.getAllStores = async (req, res) => {
    try {
        const stores = await Store.find().populate('user_id', 'name email');
        res.json(stores);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getStoreProfile = async (req, res) => {
    try {
        const store = await Store.findOne({ user_id: req.user.id });
        
        if (!store) {
            return res.status(404).json({ message: "You don't have a store yet" });
        }

        const productCount = await Product.countDocuments({ store_id: store._id });
        const sales = await TransactionDetail.find({ store_id: store._id })
            .populate({
                path: 'transaction_id',
                match: { payment_status: 'settlement' }
            });
        const salesCount = sales.filter(item => item.transaction_id !== null).length;
        res.json({
            ...store._doc,
            productCount: productCount || 0,
            salesCount: salesCount || 0
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

