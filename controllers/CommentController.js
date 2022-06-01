const { Comment, Post } = require("../models/");

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
                { new: true}
            );
            res.send({msg: "Comment updated", comment});
        } catch (error) {
            console.error(error);
            res.status(500).send({ msg: "Error updating comment" });
        }
    }
};

module.exports = CommentController;