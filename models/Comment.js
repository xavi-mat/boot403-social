const mongoose = require('mongoose');
const ObjectId = mongoose.SchemaTypes.ObjectId;

const CommentSchema = new mongoose.Schema({
    postId: {
        type: ObjectId,
        ref: "Post",
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    author: {
        type: ObjectId,
        ref: "User",
        required: true,
    },
    image: String,
    likes: [{
        type: ObjectId,
        ref: "User",
    }],
}, { timestamps: true });

const Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;
