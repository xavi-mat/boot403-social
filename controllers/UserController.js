const { User, Post, Comment } = require("../models/");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { jwt_secret } = require("../config/config.json")["development"];
const transporter = require("../config/nodemailer");
const confirmEmailHTML = require("../templates/confirmEmailHTML");
const fs = require("fs");  // Used for the fakeEmail
const { faker } = require("@faker-js/faker");

const UserController = {
    async register(req, res, next) {
        try {
            // Need data
            if (!req.body.username || !req.body.email || !req.body.password) {
                return res.status(400).send({ msg: "Data required: username, email, password" });
            }
            req.body.role = "user"; // Assing role by default
            req.body.passhash = bcrypt.hashSync(req.body.password, 10);
            req.body.avatar = 'http://localhost:8080/avatars/avatar.png';
            req.body.confirmed = false;
            req.body.active = true;
            const user = await User.create(req.body);
            const emailToken = jwt.sign(
                { email: req.body.email },
                jwt_secret,
                { expiresIn: "48h", }
            );
            const url = "http://localhost:8080/users/confirm/" + emailToken;
            const confirmEmailContent = confirmEmailHTML(
                req.body.username,
                req.body.email,
                emailToken,
                'http://localhost:8080'
            );
            // 🚨🚨🚨 Check if port 465 is closed🚨🚨🚨
            // await transporter.sendMail({
            //     to: req.body.email,
            //     subject: "Confirme su registro",
            //     html: confirmEmailContent,
            // });
            // Fake email: Create html web with link
            fs.writeFileSync('fakeEmail.html', confirmEmailContent);
            return res.status(201).send({
                msg: "We have sent a mail to confirm the registration",
                user,
            });
        } catch (error) {
            console.error(error)
            return res.status(400).send({ msg: 'Error creating user' })
        }
    },
    async confirmEmail(req, res) {
        try {
            const token = req.params.emailToken;
            const payload = jwt.verify(token, jwt_secret);
            await User.updateOne(
                { email: payload.email },
                { confirmed: true }
            );
            return res.redirect('/');
        } catch (error) {
            console.error(error);
            return res.status(400).send({ msg: 'Error verifying email' });
        }
    },
    async cleanAll(req, res) {
        try {
            // Empty all
            const users = await User.deleteMany({});
            const posts = await Post.deleteMany({});
            const comments = await Comment.deleteMany({});
            // Put 10 users
            const usersId = [];
            for (let i = 0; i < 10; i++) {
                const user = {
                    username: faker.name.findName(),
                    email: `fake${i}@email.com`,
                    passhash: bcrypt.hashSync('123456', 10),
                    avatar: faker.internet.avatar(),
                    role: "user",
                    confirmed: true,
                    active: true,
                };
                const newUser = await User.create(user);
                usersId.push(newUser._id);
            }
            // Write 30 posts
            usersId.forEach(async (userId) => {
                for (let i = 0; i < 3; i++) {
                    const post = {
                        title: faker.lorem.sentence(),
                        body: faker.lorem.paragraph(),
                        author: userId,
                        image: faker.image.cats(300, 300, true),
                    };
                    const newPost = await Post.create(post);
                    await User.findByIdAndUpdate(userId, { $push: { posts: newPost._id } });
                    for (let i = 0; i < 2; i++) {
                        const comment = {
                            postId: newPost._id,
                            text: faker.lorem.paragraph(),
                            author: usersId[Math.floor(Math.random() * usersId.length)],
                            image: faker.image.cats(300, 300, true),
                        };
                        const newComment = await Comment.create(comment);
                        await Post.findByIdAndUpdate(newPost._id, { $push: { comments: newComment._id } });
                        await User.findByIdAndUpdate(comment.author, { $push: { comments: newComment._id } });
                    }
                }
            });
            return res.send({ msg: "Cleaned", users, posts, comments })
        } catch (error) {
            console.error(error);
            return res.status(400).send({ msg: 'Error cleaning' });
        }
    },
    async login(req, res) {
        try {
            const user = await User.findOne({ email: req.body.email });
            if (!user) {
                return res.status(404).send({ msg: "Wrong credentials" });
            }
            const passwordMatch = await bcrypt.compare(req.body.password, user.passhash);
            if (!passwordMatch) {
                return res.status(404).send({ msg: "Wrong credentials" });
            }
            if (!user.confirmed) {
                return res.send({ msg: "Please, confirm your email" });
            }
            const token = jwt.sign({ _id: user._id }, jwt_secret);
            while (user.tokens.length > 4) {
                user.tokens.shift();
            }
            user.tokens.push(token);
            await user.save();
            user.passhash = undefined;
            user.tokens = undefined;
            user.confirmed = undefined;
            return res.send({ msg: `Welcome ${user.username}`, token, user });
        } catch (error) {
            console.error(error);
            return res.status(400).send({ msg: 'Login error' });
        }
    },
    async getData(req, res) {
        try {
            const user = await User.findById(
                req.user._id)
                // { tokens: 0, confirmed: 0, active: 0, passhash: 0 })
                .populate('posts', { author: 0 })
                .populate('comments', { author: 0, postId: 0 })
                .populate({ path: 'followers', select: { username: 1, avatar: 1 } });
            console.log("user.passhash", user);
            return res.send({
                msg: "User data",
                user,
                followersCount: user.followers.length
            });
        } catch (error) {
            console.error(error);
            return res.status(400).send({ msg: 'Error getting data' });
        }
    },
    async logout(req, res) {
        try {
            await User.findByIdAndUpdate(
                req.user._id,
                { $pull: { tokens: req.headers.authorization } }
            );
            return res.send({ msg: "Logout successful" });
        } catch (error) {
            console.error(error);
            return res.status(500).send({ msg: 'Logout error' });
        }
    },
    async update(req, res) {
        try {
            // Can only update some fields
            const avatar = req.file ?
                `http://localhost:8080/avatars/${req.file.filename}` :
                undefined;

            const updatedUser = {
                username: req.body.username,
                avatar,
            };
            const user = await User.findByIdAndUpdate(
                req.user._id,
                updatedUser,
                { new: true }
            );
            user.passhash = undefined;  // Don't send this info
            user.tokens = undefined;
            user.confirmed = undefined;
            return res.send({ msg: "Updated", user });
        } catch (error) {
            console.error(error);
            return res.status(400).send({ msg: 'Update error' });
        }
    },
    async follow(req, res) {
        try {
            const user = await User.findOneAndUpdate(
                { _id: req.params._id, followers: { $nin: req.user._id } },
                { $push: { followers: req.user._id } }
            );
            if (user) {
                await User.findByIdAndUpdate(
                    req.user._id,
                    { $push: { following: req.params._id } }
                );
                return res.send({ msg: "Following" })
            } else {
                return res.status(400).send({ msg: 'Error following user' });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).send({ msg: 'Error following user' });
        }
    },
    async unfollow(req, res) {
        try {
            const user = await User.findOneAndUpdate(
                { _id: req.params._id, followers: { $in: req.user._id } },
                { $pull: { followers: req.user._id } }
            );
            if (user) {
                await User.findByIdAndUpdate(
                    req.user._id,
                    { $pull: { following: req.params._id } }
                );
                return res.send({ msg: "Unfollowing" });
            } else {
                return res.status(400).send({ msg: 'Error unfollowing user' });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).send({ msg: 'Error unfollowing user' });
        }
    },
    async searchByUsername(req, res) {
        try {
            if (req.params.username.length > 30) {
                return res.send({ msg: "Search string too long" });
            }
            const username = new RegExp(req.params.username, 'i');
            const users = await User.find(
                { username, role: { $nin: 'admin' } },
                { username: 1, avatar: 1, role: 1 }
            );
            return res.send(users);
        } catch (error) {
            console.error(error);
            return res.status(500).send({ msg: 'Error searching users' });
        }
    },
    async getById(req, res) {
        try {
            const user = await User.findById(
                req.params._id,
                { email: 0, passhash: 0, role: 0, confirmed: 0, tokens: 0 }
            );
            return res.send(user);
        } catch (error) {
            console.error(error);
            return res.status(500).send({ msg: 'Error searching user' });
        }
    }
}

module.exports = UserController;