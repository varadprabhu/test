const express = require("express");
const routes = express.Router();
const {postArticle,getArticles,likeArticle,unlikeArticle,searchArticle,getArticle, getComments, newComment}=require("../controllers/article");
const fetchuser = require("../middlewares/fetchuser");
routes.post("/",fetchuser,postArticle);
routes.get("/",fetchuser,getArticles);
routes.get("/comments/:postId",fetchuser,getComments);
routes.post("/comments/:postId",fetchuser,newComment);
routes.get("/find/:postId",fetchuser,getArticle);
routes.patch("/like/:postId",fetchuser,likeArticle);
routes.patch("/unlike/:postId",fetchuser,unlikeArticle);
routes.get("/filter/:searchTerm",searchArticle);

module.exports = routes