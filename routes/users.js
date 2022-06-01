'use strict';
const express = require("express");
const UserController = require("../controllers/UserController");
const { authentication } = require("../middleware/authentication");
const router = express.Router();
const multer = require("multer");
const upload = multer({dest: '../public/avatars/'});

router.post('/', UserController.register);
router.get('/confirm/:emailToken', UserController.confirmEmail);
router.post('/login', UserController.login);
router.get('/', authentication, UserController.getData);
router.delete('/logout', authentication, UserController.logout);
router.put('/', authentication, upload.single('avatar'), UserController.update);

router.delete('/clean-all', UserController.cleanAll);

module.exports = router;