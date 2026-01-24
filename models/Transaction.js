const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  buyer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  order_id: { type: String, required: true, unique: true }, 
  total_price: { type: Number, required: true },
  payment_status: { 
    type: String, 
    enum: ['pending', 'settlement', 'expire', 'cancel', 'deny'], 
    default: 'pending' 
  },
  snap_token: { type: String }, 
  payment_logs: [{
    status_code: String,
    raw_response: Object,
    created_at: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Transaction', TransactionSchema);