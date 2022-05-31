'use strict';
const express = require("express");
const UserController = require("../controllers/UserController");
const { authentication } = require("../middleware/authentication");
const router = express.Router();

router.post('/', UserController.register);
router.get('/confirm/:emailToken', UserController.confirmEmail);
router.post('/login', UserController.login);
router.get('/', authentication, UserController.getData);
router.delete('/logout', authentication, UserController.logout);
router.put('/', authentication, UserController.update);

router.delete('/clean-all', UserController.cleanUsers);

module.exports = router;