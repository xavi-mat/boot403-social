const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const UserSchema = new mongoose.Schema({
    username: String,
    email: {
        type: String,
        unique: true,
        required: true,
    },
    passhash: String,
    avatar: String,
    role: {
        type: String,
        default: 'user',
        enum: ['admin', 'mod', 'vip', 'user'],
    },
    confirmed: Boolean,
    active: Boolean,
    tokens: [String],
    posts: [{
        type: ObjectId,
        ref: "Post"
    }],
    comments: [{
        type: ObjectId,
        ref: "Comment"
    }],
    likedPosts: [{
        type: ObjectId,
        ref: "Post"
    }],
    likedComments: [{
        type: ObjectId,
        ref: "Comments"
    }],
    following: [{
        type: ObjectId,
        ref: "User",
    }],
    followers: [{
        type: ObjectId,
        ref: "User",
    }],
}, { timestamps: true });

UserSchema.methods.toJSON = function () {
    const user = this._doc;
    delete user.tokens;
    delete user.passhash;
    return user;
}

const User = mongoose.model('User', UserSchema);

module.exports = User;
