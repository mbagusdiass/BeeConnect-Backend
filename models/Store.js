const mongoose = require('mongoose');

const StoreSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  store_name: { type: String, required: true },
  store_description: { type: String },
  store_address: { type: String },
  store_image: { type: String, default: "" },
  is_active: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Store', StoreSchema);