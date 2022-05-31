'use strict';
const express = require("express");
const PostController = require("../controllers/PostController");
const { authentication } = require("../middleware/authentication");
const router = express.Router();

router.post('/', authentication, PostController.create);
router.get('/id/:_id', PostController.getById);
router.get('/title/:title', PostController.getByTitle);
router.get('/page/:page', PostController.getAll);
router.put('/id/:_id', authentication, PostController.update);
router.delete('/id/:_id', authentication, PostController.delete);

module.exports = router;