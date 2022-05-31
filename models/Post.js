const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    title: String,
    body: String,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    image: String,
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }],
    likes: [String],  // _IDs from Users
}, { timestamps: true });

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;
