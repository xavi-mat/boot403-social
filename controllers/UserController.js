const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { jwt_secret } = require("../config/config.json")["development"];
const transporter = require("../config/nodemailer");
const confirmEmailHTML = require("../templates/confirmEmailHTML");
const fs = require("fs");  // Used for the fakeEmail

const UserController = {
    async register(req, res) {
        try {
            // Need data
            if (!req.body.username || !req.body.email || !req.body.password) {
                return res.status(400).send({ msg: "Data required: username, email, password" });
            }
            req.body.role = "user"; // Assing role by default
            req.body.passhash = bcrypt.hashSync(req.body.password, 10);
            req.body.avatar = '';
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
            // Validate token
            const token = req.params.emailToken;
            const payload = jwt.verify(token, jwt_secret);
            const result = await User.updateOne(
                { email: payload.email },
                { confirmed: true }
            );
            console.warn(result);
            return res.send({ msg: "Email confirmed" });
        } catch (error) {
            console.error(error);
            return res.status(400).send({ msg: 'Error verifying email' });
        }
    },
    async cleanUsers(req, res) {
        try {
            const result = await User.deleteMany({});
            return res.send({ msg: "Cleaned", result })
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
            const result = await User.updateOne(
                { _id: user._id },
                { $push: { tokens: [token] } }
            );
            return res.send({ msg: `Welcome ${user.username}`, token, user });
        } catch (error) {
            console.error(error);
            return res.status(400).send({ msg: 'Login error' });
        }
    },
    async getData(req, res) {
        try {
            const user = await User.findById(req.user._id).populate('posts');
            return res.send({ msg: "User data", user: req.user });
        } catch (error) {
            console.error(error);
            return res.status(400).send({ msg: 'Error getting data' });
        }
    },
    async logout(req, res) {
        try {
            const result = await User.updateOne(
                { _id: req.user._id },
                { $pull: { tokens: req.headers.authorization } }
            );
            if (result) {
                return res.send({ msg: "Logout successful" });
            } else {
                return res.send({ msg: "Unable to logout" });
            }
        } catch (error) {
            console.error(error);
            return res.status(400).send({ msg: 'Logout error' });
        }
    },
    async update(req, res) {
        try {
            // Can only update some fields
            const updatedUser = {
                username: req.body.username,
                avatar: req.body.avatar,
            };
            const user = await User.findByIdAndUpdate(
                req.user._id,
                updatedUser,
                { new: true }
            );
            user.passhash = undefined;  // Don't send this info
            return res.send({ msg: "Updated", user });
        } catch (error) {
            console.error(error);
            return res.status(400).send({ msg: 'Update error' });
        }
    }
}

module.exports = UserController;