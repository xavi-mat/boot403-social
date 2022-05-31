'use strict';
const express = require("express");
const PostController = require("../controllers/PostController");
const { authentication } = require("../middleware/authentication");
const router = express.Router();

router.post('/', authentication, PostController.create);

module.exports = router;