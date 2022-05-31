const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { jwt_secret } = require("../config/config.json")["development"];
const path = require("path");
const transporter = require("../config/nodemailer");

const UserController ={
    async create(req,res){
        try {
            // Validate
            const user = await User.create(req.body)
            res.status(201).send(user)
        } catch (error) {
            console.error(error)
            res.status(500).send({ msg: 'Error creating user' })
        }
    },
}
module.exports = UserController;
