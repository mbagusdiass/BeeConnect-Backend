const Category = require('../models/Category');

exports.createCategory = async (req, res) => {
    try {
        const { category_name } = req.body;
        
        const category = new Category({ 
            category_name,
            category_image: req.file ? `/uploads/categories/${req.file.filename}` : ""
        });

        await category.save();
        res.status(201).json({ message: "Category created!", category });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.updateCategory = async (req, res) => {
    try {
        const { category_name } = req.body;
        const updateData = {};
        
        if (category_name) {
            updateData.category_name = category_name;
        }
        if (req.file) {
            updateData.category_image = `/uploads/categories/${req.file.filename}`;
        }

        const category = await Category.findByIdAndUpdate(
            req.params.id, 
            { $set: updateData }, 
            { new: true, runValidators: true }
        );

        if (!category) {
            return res.status(404).json({ message: "Kategori tidak ditemukan" });
        }
        
        res.json({ message: "Kategori berhasil diperbarui!", category });
    } catch (err) {
        console.error("Update Category Error:", err);
        res.status(500).json({ message: err.message });
    }
};
exports.deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) return res.status(404).json({ message: "Category not found" });
        
        res.json({ message: "Category deleted!" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};