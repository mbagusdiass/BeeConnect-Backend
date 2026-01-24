const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['user', 'seller', 'admin'], 
    default: 'user' 
  },
  profile_picture: { type: String, default: "" },
  phone_number: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);