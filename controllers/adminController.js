const User = require('../models/User');
const Store = require('../models/Store');

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.adminUpdateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { $set: req.body }, 
            { new: true }
        ).select('-password');
        res.json({ message: "User updated by Admin", user });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: "User deleted by Admin" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteStore = async (req, res) => {
    try {
        await Store.findByIdAndDelete(req.params.id);
        res.json({ message: "Store deleted by Admin" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.adminUpdateStoreStatus = async (req, res) => {
    try {
        const { is_active } = req.body;
        const store = await Store.findByIdAndUpdate(
            req.params.id,
            { $set: { is_active } },
            { new: true }
        ).populate('user_id', 'name email');

        if (!store) return res.status(404).json({ message: "Toko tidak ditemukan" });

        res.json({ 
            message: `Toko berhasil ${is_active ? 'diaktifkan' : 'dinonaktifkan'}`, 
            store 
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.adminUpdateStore = async (req, res) => {
    try {
        const { store_name, store_description, store_address, is_active } = req.body;
        
        const store = await Store.findByIdAndUpdate(
            req.params.id,
            { $set: { store_name, store_description, store_address, is_active } },
            { new: true }
        ).populate('user_id', 'name email');

        if (!store) return res.status(404).json({ message: "Toko tidak ditemukan" });

        res.json({ message: "Toko berhasil diperbarui oleh Admin", store });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};