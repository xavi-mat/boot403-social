'use strict';
const express = require("express");
const PostController = require("../controllers/PostController");
const { authentication } = require("../middleware/authentication");
const router = express.Router();

router.post('/', authentication, PostController.create);
router.get('/id/:_id', PostController.getById);

module.exports = router;