const { Comment, Post, User } = require("../models/");

const CommentController = {
    async create(req, res) {
        try {
            const newComment = {
                postId: req.body.postId,
                text: req.body.text,
                author: req.user._id,
                image: req.body.image,
            };
            const comment = await Comment.create(newComment);
            const post = await Post.findByIdAndUpdate(
                req.body.postId,
                { $push: { comments: comment._id } },
                { new: true }
            );
            await User.findByIdAndUpdate(
                req.user._id,
                { $push: { comments: comment._id } }
            );
            res.status(201).send({ msg: "Comment created", comment, post });
        } catch (error) {
            console.error(error);
            res.status(400).send({ msg: "Error creating comment" });
        }
    },
    async delete(req, res) {
        try {
            const comment = await Comment.findOneAndDelete(
                { _id: req.params._id, author: req.user._id }
            );
            await Post.findByIdAndUpdate(comment.postId,
                { $pull: { comments: comment._id } }
            );
            await User.findByIdAndUpdate(comment.author,
                { $pull: { comments: comment._id } }
            );
            res.send({ msg: "Comment deleted", comment });
        } catch (error) {
            console.error(error);
            res.status(500).send({ msg: "Error deleting comment" });
        }
    },
    async update(req, res) {
        try {
            const updatedComment = {
                text: req.body.text,
                image: req.body.image,
            };
            const comment = await Comment.findByIdAndUpdate(
                req.params._id,
                updatedComment,
                { new: true }
            );
            res.send({ msg: "Comment updated", comment });
        } catch (error) {
            console.error(error);
            res.status(500).send({ msg: "Error updating comment" });
        }
    },
    async getById(req, res) {
        try {
            const comment = await Comment.findById(req.params._id)
                .populate({ path: 'author', select: { username: 1, avatar: 1 } });
            return res.send({ msg: "Comment", comment });
        } catch (error) {
            console.error(error);
            res.status(500).send({ msg: "Error getting comment" });
        }
    },
    async like(req, res) {
        try {
            const comment = await Comment.findOneAndUpdate(
                { _id: req.params._id, likes: { $nin: req.user._id } },
                { $push: { likes: req.user._id } },
                { new: true }
            );
            if (comment) {
                await User.findByIdAndUpdate(
                    req.user._id,
                    { $push: { likedComments: comment._id } }
                );
                return res.send({ msg: "Comment liked", comment });
            } else {
                res.status(400).send({ msg: "Error liking comment" });
            }
        } catch (error) {
            console.error(error);
            res.status(500).send({ msg: "Error liking comment" });
        }
    },
    async unlike(req, res) {
        try {
            const comment = await Comment.findByIdAndUpdate(
                req.params._id,
                { $pull: { likes: req.user._id } }
            );
            if (comment) {
                await User.findByIdAndUpdate(
                    req.user._id,
                    { $pull: { likedComments: comment._id } }
                );
                return res.send({ msg: "Comment unliked" });
            } else {
                res.status(400).send({ msg: "Error unliking comment" });
            }
        } catch (error) {
            console.error(error);
            res.status(500).send({ msg: "Error unliking comment" });
        }
    }
};

module.exports = CommentController;