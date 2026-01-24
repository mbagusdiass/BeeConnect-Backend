const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  store_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true },
  product_name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  weight: { type: Number, default: 100 }, 
  product_image: { type: String },
  category: { 
  type: mongoose.Schema.Types.ObjectId, 
  ref: 'Category', 
  required: true 
}
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);