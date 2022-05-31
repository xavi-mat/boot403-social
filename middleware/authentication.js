'use strict';
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { jwt_secret } = require("../config/config.json")["development"];


const authentication = async (req, res, next) => {
    try {
        const token = req.headers.authorization;
        const payload = jwt.verify(token, jwt_secret);
        const user = await User.findOne({ _id: payload._id, tokens: token });
        if (!user) {
            return res.status(401).send({ message: "Unauthorized" });
        }
        req.user = user;
        next();
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: "Token error", error });
    }
}

module.exports = { authentication };
