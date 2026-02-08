const mongoose = require('mongoose');

const TransactionDetailSchema = new mongoose.Schema({
  transaction_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Transaction', required: true },
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  store_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true },
  product_name_snapshot: { type: String, required: true },
  price_snapshot: { type: Number, required: true },
  quantity: { type: Number, required: true },
  subtotal: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('TransactionDetail', TransactionDetailSchema);