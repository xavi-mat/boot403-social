const mongoose = require('mongoose');
const Comment = require('./Comment');
const User = require('./User');

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'post title is required'],
    },
    body: {
        type: String,
        required: [true, 'post content is required'],
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, , 'post author\'s userId is required'],
    },
    image: String,
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }],
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
}, { timestamps: true });

// PostSchema.post('findOneAndDelete', async function (post, next) {
//     // Clean when deleting a Post
//     console.log(post);
//     try {
//         // Delete reference to post from author
//         await User.findByIdAndUpdate(post.author,
//             { $pull: { comments: post._id } }
//         );
//     } catch (error) {
//         console.error(error);
//     } finally {
//         next();
//     }
// });

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;
