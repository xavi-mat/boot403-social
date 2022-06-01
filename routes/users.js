'use strict';
const express = require("express");
const UserController = require("../controllers/UserController");
const { authentication } = require("../middleware/authentication");
const router = express.Router();
const { uploadAvatar } = require("../middleware/multer");

router.post('/', UserController.register);
router.post('/login', UserController.login);
router.post('/follow/:_id', authentication, UserController.follow);

router.get('/', authentication, UserController.getData);
router.get('/confirm/:emailToken', UserController.confirmEmail);
router.get('/search/:username', UserController.searchByUsername);
router.get('/id/:_id', UserController.getById);

router.put('/', authentication, uploadAvatar.single('avatar'), UserController.update);

router.delete('/logout', authentication, UserController.logout);
router.delete('/follow/:_id', authentication, UserController.unfollow);

router.delete('/clean-all', UserController.cleanAll);

module.exports = router;