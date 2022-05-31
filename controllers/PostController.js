const { Post, User } = require("../models/");
const PER_PAGE = 10;

const PostController = {
    async create(req, res) {
        try {
            const newPost = {
                title: req.body.title,
                body: req.body.body,
                author: req.user._id,
                image: req.body.image
            };
            const post = await Post.create(newPost);
            const result = await User.findByIdAndUpdate(
                req.user._id,
                { $push: { posts: post._id } }
            );
            if (result) {
                return res.status(201).send({ msg: "Post created", post });
            } else {
                return res.send({ msg: "Error creating post" })
            }
        } catch (error) {
            console.error(error);
            return res.status(400).send({ msg: 'Error creating post', error });
        }
    },
    async getById(req, res) {
        try {
            const post = await Post.findById(req.params._id).populate('author', { username: 1, avatar: 1 });
            return res.send(post);
        } catch (error) {
            console.error(error);
            return res.status(400).send({ msg: 'Error getting post' });
        }
    },
    async getByTitle(req, res) {
        try {
            if (req.params.title.length > 30) {
                return res.send({ msg: "String too long" });
            }
            const title = new RegExp(req.params.title, 'i');
            const posts = await Post.find({ title })
                .populate('author', { username: 1, avatar: 1 });
            return res.send(posts);
        } catch (error) {
            console.error(error);
            return res.status(400).send({ msg: 'Error getting posts' });
        }
    },
    async getAll(req, res) {
        try {
            // Pagination
            let page = req.params.page;
            if (isNaN(page) || page < 1) {
                return res.send({ msg: "Page must be a number greater than 0" });
            }
            const total = await Post.count();
            const maxPages = Math.ceil(total / PER_PAGE);
            page = Math.min(page, maxPages);
            const posts = await Post.find()
                .limit(PER_PAGE)
                .skip(PER_PAGE * (page - 1))
                .populate('author', { username: 1, avatar: 1 })
                .populate('comments');
            res.send({ msg: "All posts", total, page, maxPages, posts });
        } catch (error) {
            console.error(error);
            return res.status(400).send({ msg: 'Error getting posts' });
        }
    },
    async update(req, res) {
        try {
            const updatedPost = {
                title: req.body.title,
                body: req.body.body,
                image: req.body.image
            };
            const post = await Post.findOneAndUpdate(
                { _id: req.params._id, author: req.user._id },
                updatedPost,
                { new: true }
            );
            return res.send({ msg: "Post updated", post });
        } catch (error) {
            console.error(error);
            return res.status(400).send({ msg: 'Error updating post' });
        }
    },
    async delete(req, res) {
        try {
            const post = await Post.findOneAndDelete(
                { _id: req.params._id, author: req.user._id }
            );
            res.send({ msg: "Post deleted", post });
        } catch (error) {
            console.error(error);
            return res.status(400).send({ msg: 'Error deleting post' });
        }
    }

};

module.exports = PostController;