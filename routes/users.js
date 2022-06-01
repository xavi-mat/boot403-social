'use strict';
const express = require("express");
const UserController = require("../controllers/UserController");
const { authentication } = require("../middleware/authentication");
const router = express.Router();

// Multer funcionality from https://stackoverflow.com/a/39650303
var multer = require('multer');
var path = require('path');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/avatars/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)) //Appending extension
    }
});
var upload = multer({ storage: storage });

router.post('/', UserController.register);
router.get('/confirm/:emailToken', UserController.confirmEmail);
router.post('/login', UserController.login);
router.get('/', authentication, UserController.getData);
router.delete('/logout', authentication, UserController.logout);
router.put('/', authentication, upload.single('avatar'), UserController.update);

router.delete('/clean-all', UserController.cleanAll);

module.exports = router;