const express = require("express");
const routes = express.Router();
const fetchuser = require("../middlewares/fetchuser");
const { likeComment, dislikeComment } = require("../controllers/comment");
routes.patch("/like/:id", fetchuser, likeComment);
routes.patch("/unlike/:id", fetchuser, dislikeComment);


module.exports = routes