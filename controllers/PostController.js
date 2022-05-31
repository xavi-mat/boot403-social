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
    }

};

module.exports = PostController;