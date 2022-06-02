const { Post, User } = require("../models/");

const PostController = {
    async create(req, res, next) {
        try {
            const image = req.file ?
                `http://localhost:8080/imgs/${req.file.filename}` :
                undefined;
            const newPost = {
                title: req.body.title,
                body: req.body.body,
                author: req.user._id,
                image,
            };
            const post = await Post.create(newPost);
            await User.findByIdAndUpdate(
                req.user._id,
                { $push: { posts: post._id } }
            );
            return res.status(201).send({ msg: "Post created", post });
        } catch (error) {
            error.origin = 'post';
            error.suborigin = 'create';
            next(error);
        }
    },
    async getById(req, res, next) {
        try {
            const post = await Post.findById(req.params._id)
                .populate('author', { username: 1, avatar: 1, role: 1 })
                .populate({ path: 'comments', populate: { path: 'author', select: { username: 1, avatar: 1, role: 1 } } });
            return res.send(post);
        } catch (error) {
            error.origin = 'post';
            error.suborigin = 'getById';
            next(error);
        }
    },
    async getByTitle(req, res, next) {
        try {
            if (req.params.title.length > 30) {
                return res.send({ msg: "String too long" });
            }
            const title = new RegExp(req.params.title, 'i');
            const posts = await Post.find({ title })
                .populate('author', { username: 1, avatar: 1, role: 1 });
            return res.send(posts);
        } catch (error) {
            error.origin = 'post';
            error.suborigin = 'getByTitle';
            next(error);
        }
    },
    async getAll(req, res, next) {
        try {
            // Pagination
            let { page = 1, limit = 10 } = req.query;
            // Limit per page:
            if (isNaN(limit)) { limit = 10; }
            limit = Math.max(1, Math.min(limit, 20));
            const total = await Post.count();
            const maxPages = Math.ceil(total / limit);
            // Current page
            if (isNaN(page)) { page = 1; }
            page = Math.max(1, Math.min(page, maxPages));
            const posts = await Post.find()
                .sort('-updatedAt')
                .limit(limit)
                .skip(limit * (page - 1))
                .populate('author', { username: 1, avatar: 1, role: 1 })
                .populate({
                    path: 'comments',
                    populate: { path: 'author', select: { username: 1, avatar: 1, role: 1 } }
                });
            return res.send({ msg: "All posts", total, page, maxPages, posts });
        } catch (error) {
            error.origin = 'post';
            error.suborigin = 'getAll';
            next(error);
        }
    },
    async update(req, res, next) {
        try {
            const image = req.file ?
                `http://localhost:8080/imgs/${req.file.filename}` :
                undefined;
            const updatedPost = {
                title: req.body.title,
                body: req.body.body,
                image,
            };
            const post = await Post.findOneAndUpdate(
                { _id: req.params._id, author: req.user._id },
                updatedPost,
                { new: true }
            );
            return res.send({ msg: "Post updated", post });
        } catch (error) {
            error.origin = 'post';
            error.suborigin = 'update';
            next(error);
        }
    },
    async delete(req, res, next) {
        try {
            const post = await Post.findOneAndDelete(
                { _id: req.params._id, author: req.user._id }
            );
            await User.findByIdAndUpdate(
                req.user_id,
                { $pull: { comments: req.params._id } }
            );
            return res.send({ msg: "Post deleted", post });
        } catch (error) {
            error.origin = 'post';
            error.suborigin = 'delete';
            next(error);
        }
    },
    async like(req, res, next) {
        try {
            const post = await Post.findOneAndUpdate(
                { _id: req.params._id, likes: { $nin: req.user._id } },
                { $push: { likes: req.user._id } },
                { new: true }
            );
            if (post) {
                await User.findByIdAndUpdate(
                    req.user._id,
                    { $push: { likedPosts: post._id } }
                );
                return res.send({ msg: "Post liked", post });
            } else {
                return res.status(400).send({ msg: 'Error liking unexistent post' });
            }
        } catch (error) {
            error.origin = 'post';
            error.suborigin = 'like';
            next(error);
        }
    },
    async unlike(req, res, next) {
        try {
            const post = await Post.findByIdAndUpdate(
                req.params._id,
                { $pull: { likes: req.user._id } }
            );
            if (post) {
                await User.findByIdAndUpdate(
                    req.user._id,
                    { $pull: { likedPosts: post._id } }
                );
                return res.send({ msg: "Post unliked" });
            } else {
                return res.send({ msg: "Error unliking inexistent post" });
            }
        } catch (error) {
            error.origin = 'post';
            error.suborigin = 'unlike';
            next(error);
        }
    }
};

module.exports = PostController;