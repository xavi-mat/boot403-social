const Post = require("../models/Post");

const PostController = {
    async create(req, res) {
        try {
            const newPost = {
                title: req.body.title,
                body: req.body.body,
                author: req.user._id
            };
            const post = await Post.create(newPost);
            return res.status(201).send({msg:"Post created", post});
        } catch (error) {
            console.error(error);
            return res.status(400).send({ msg: 'Error creating post' });
        }
    },
    async getById(req, res) {
        try {
            const post = await Post.findById(req.params._id).populate('author', {username:1,avatar:1});
            return res.send(post);
        } catch (error) {
            console.error(error);
            return res.status(400).send({ msg: 'Error getting post' });
        }
    }

};

module.exports = PostController;