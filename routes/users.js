'use strict';
const express = require("express");
const UserController = require("../controllers/UserController");
const router = express.Router();

router.post('/', UserController.register);
router.get('/confirm/:emailToken', UserController.confirmEmail);
router.post('/login')
router.delete('/clean-all', UserController.cleanUsers);

module.exports = router;