const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.updateProfile = async (req, res) => {
    try {
        const { phone_number, password, profile_picture } = req.body;
        const updateData = {};
        if (phone_number) updateData.phone_number = phone_number;
        if (profile_picture) updateData.profile_picture = profile_picture;
        if (password) {
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(password, salt);
        }
        const user = await User.findByIdAndUpdate(
            req.user.id, 
            { $set: updateData }, 
            { new: true }
        ).select('-password');

        res.json({ message: "Profile updated successfully", user });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};