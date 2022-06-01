const { Post, User } = require("../models/");
const PER_PAGE = 10;

const PostController = {
    async create(req, res) {
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
            console.error(error);
            return res.status(400).send({ msg: 'Error creating post', error });
        }
    },
    async getById(req, res) {
        try {
            const post = await Post.findById(req.params._id)
                .populate('author', { username: 1, avatar: 1 })
                .populate({ path: 'comments', populate: { path: 'author', select: { username: 1, avatar: 1 } } });
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
                page = 1;
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
            console.error(error);
            return res.status(400).send({ msg: 'Error updating post' });
        }
    },
    async delete(req, res) {
        try {
            const post = await Post.findOneAndDelete(
                { _id: req.params._id, author: req.user._id }
            );
            await User.findByIdAndUpdate(
                req.user_id,
                { $pull: { comments: req.params._id } }
            );
            res.send({ msg: "Post deleted", post });
        } catch (error) {
            console.error(error);
            return res.status(400).send({ msg: 'Error deleting post' });
        }
    },
    async like(req, res) {
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
            console.error(error);
            return res.status(500).send({ msg: 'Error liking post' });
        }
    },
    async unlike(req, res) {
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
            console.error(error);
            return res.status(400).send({ msg: 'Error unliking post' });
        }
    }
};

module.exports = PostController;