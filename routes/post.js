const express = require("express");
const routes = express.Router();
const { newPost, newPostTemp, findPost, getPosts, filterPosts, deletePost, likePost, dislikePost, newComment, getComments, approvePost, disapprovePost } = require("../controllers/post");
const fetchuser = require("../middlewares/fetchuser")
routes.get("/", fetchuser, getPosts);
routes.post("/", fetchuser, newPost);
routes.post("/analysis", fetchuser, newPostTemp);
routes.get("/find/:id", findPost);
routes.get("/filter/:word", filterPosts);
routes.delete("/:id", fetchuser, deletePost);
routes.patch("/like/:id", fetchuser, likePost);
routes.patch("/unlike/:id", fetchuser, dislikePost);
routes.post("/comments/:id", fetchuser, newComment);
routes.get("/comments/:id", getComments);
routes.patch("/approve/:id", fetchuser, approvePost);
routes.patch("/disapprove/:id", fetchuser, disapprovePost);
module.exports = routes; 