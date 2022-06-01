'use strict';
const express = require("express");
const CommentController = require("../controllers/CommentController");
const { authentication, isCommentAuthor } = require("../middleware/authentication");
const router = express.Router();

router.post('/', authentication, CommentController.create);
router.delete('/id/:_id', authentication, isCommentAuthor, CommentController.delete);
router.put('/id/:_id', authentication, isCommentAuthor, CommentController.update);
router.get('/id/:_id', CommentController.getById);
router.post('/like/:_id', authentication, CommentController.like);
router.delete('/like/:_id', authentication, CommentController.unlike);

module.exports = router;