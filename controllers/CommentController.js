const { Comment, Post, User } = require("../models/");

const CommentController = {
    async create(req, res, next) {
        try {
            const image = req.file ?
                `http://localhost:8080/imgs/${req.file.filename}` :
                undefined;
            const newComment = {
                postId: req.body.postId,
                text: req.body.text,
                author: req.user._id,
                image,
            };
            const comment = await Comment.create(newComment);
            const post = await Post.findByIdAndUpdate(
                req.body.postId,
                { $push: { comments: comment._id } },
                { new: true }
            );
            if (!post) {
                await Comment.findByIdAndDelete(comment._id);
                return res.status(400).send({msg:"Post does not exist"});
            }
            await User.findByIdAndUpdate(
                req.user._id,
                { $push: { comments: comment._id } }
            );
            return res.status(201).send({ msg: "Comment created", comment, post });
        } catch (error) {
            error.origin = 'comment';
            error.suborigin = 'create';
            next(error);
        }
    },
    async delete(req, res, next) {
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
            return res.send({ msg: "Comment deleted", comment });
        } catch (error) {
            error.origin = 'comment';
            error.suborigin = 'delete';
            next(error);
        }
    },
    async update(req, res, next) {
        try {
            const image = req.file ?
                `http://localhost:8080/imgs/${req.file.filename}` :
                undefined;
            const updatedComment = {
                text: req.body.text,
                image,
            };
            const comment = await Comment.findByIdAndUpdate(
                req.params._id,
                updatedComment,
                { new: true }
            );
            return res.send({ msg: "Comment updated", comment });
        } catch (error) {
            error.origin = 'comment';
            error.suborigin = 'update';
            next(error);
        }
    },
    async getById(req, res, next) {
        try {
            const comment = await Comment.findById(req.params._id)
                .populate({
                    path: 'author',
                    select: { username: 1, avatar: 1, role: 1 }
                })
                .populate({
                    path: 'likes',
                    select: { username: 1, avatar: 1, role: 1 }
                });
            return res.send({ msg: "Comment", comment });
        } catch (error) {
            error.origin = 'comment';
            error.suborigin = 'getById';
            next(error);
        }
    },
    async like(req, res, next) {
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
                return res.status(400).send({ msg: "Error liking comment" });
            }
        } catch (error) {
            error.origin = 'comment';
            error.suborigin = 'like';
            next(error);
        }
    },
    async unlike(req, res, next) {
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
            error.origin = 'comment';
            error.suborigin = 'unlike';
            next(error);
        }
    }
};

module.exports = CommentController;