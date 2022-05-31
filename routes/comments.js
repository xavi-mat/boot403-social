'use strict';
const express = require("express");
const CommentController = require("../controllers/CommentController");
const { authentication } = require("../middleware/authentication");
const router = express.Router();

router.post('/', authentication, CommentController.create);

module.exports = router;