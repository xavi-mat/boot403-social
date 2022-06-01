'use strict';
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { jwt_secret } = require("../config/config.json")["development"];


const authentication = async (req, res, next) => {
    try {
        const token = req.headers.authorization;
        const payload = jwt.verify(token, jwt_secret);
        const user = await User.findOne(
            { _id: payload._id, tokens: token },
            { passhash: 0, tokens: 0 }
        );
        if (!user) {
            return res.status(401).send({ msg: "Unauthorized" });
        }
        console.log('ANTES: req.user es:',req.user);
        req.user = user;
        console.log('DESPUÉS: req.user es:',req.user);
        next();
    } catch (error) {
        console.log(error);
        return res.status(500).send({ msg: "Token error", error });
    }
}

module.exports = { authentication };
