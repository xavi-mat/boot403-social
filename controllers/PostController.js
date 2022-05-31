const { Post, User } = require("../models/");

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
                .populate('author', {username:1, avatar:1});
            return res.send(posts);
        } catch (error) {
            console.error(error);
            return res.status(400).send({ msg: 'Error getting post' });
        }
    }

};

module.exports = PostController;