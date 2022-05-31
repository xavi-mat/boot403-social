const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: String,
    email: {
        type: String,
        unique: true,
        required: true,
    },
    passhash: String,
    avatar: String,
    role: String,
    active: Boolean,
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

module.exports = User;
