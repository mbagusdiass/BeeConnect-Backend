const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  category_name: { type: String, required: true, unique: true },
  category_image: { type: String, default: "" }
}, { timestamps: true });

module.exports = mongoose.model('Category', CategorySchema);