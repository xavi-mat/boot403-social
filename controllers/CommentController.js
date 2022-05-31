const { Comment, Post } = require("../models/");

const CommentController = {
    async create(req, res) {
        try {
            const newComment = {
                post_id: req.body.post_id,
                text: req.body.text,
                author: req.user._id,
                image: req.body.image,
            };
            const comment = await Comment.create(newComment);
            const post = await Post.findByIdAndUpdate(
                req.body.post_id,
                { $push: { comments: comment._id } },
                { new: true }
            );
            res.status(201).send({ msg: "Comment created", comment, post });
        } catch (error) {
            console.error(error);
            res.status(400).send({ msg: "Error creating comment" });
        }
    }
};

module.exports = CommentController;