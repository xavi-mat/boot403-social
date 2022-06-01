'use strict';
const express = require("express");
const CommentController = require("../controllers/CommentController");
const { authentication, isCommentAuthor } = require("../middleware/authentication");
const router = express.Router();

router.post('/', authentication, CommentController.create);
router.delete('/id/:_id', authentication, isCommentAuthor, CommentController.delete);
router.put('/id/:_id', authentication, isCommentAuthor, CommentController.update);


module.exports = router;