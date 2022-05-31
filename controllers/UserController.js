const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { jwt_secret } = require("../config/config.json")["development"];
const transporter = require("../config/nodemailer");
const confirmEmail = require("../templates/confirm_email");

// const path = require("path");

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
                { email: req.body.email }, jwt_secret, { expiresIn: "48h", });
            const url = "http://localhost:8080/users/confirm/" + emailToken;

            // 🚨🚨🚨 Check if port 465 is closed🚨🚨🚨
            await transporter.sendMail({
                to: req.body.email,
                subject: "Confirme su registro",
                html: confirmEmail,
            });

            res.status(201).send({
                msg: "We have sent a mail to confirm the registration",
                user,
            });

        } catch (error) {
            console.error(error)
            res.status(400).send({ msg: 'Error creating user' })
        }
    },
}
module.exports = UserController;
