'use strict';
const express = require("express");
const PostController = require("../controllers/PostController");
const { authentication, isPostAuthor } = require("../middleware/authentication");
const router = express.Router();
const { uploadImg } = require("../middleware/multer");

router.post('/', authentication, uploadImg.single('image'), PostController.create);
router.post('/like/id/:_id', authentication, PostController.like);

router.get('/id/:_id', PostController.getById);
router.get('/title/:title', PostController.getByTitle);
router.get('/', PostController.getAll);

router.put(
    '/id/:_id',
    authentication,
    isPostAuthor,
    uploadImg.single('image'),
    PostController.update
);

router.delete('/id/:_id', authentication, isPostAuthor, PostController.delete);
router.delete('/like/id/:_id', authentication, PostController.unlike);

module.exports = router;