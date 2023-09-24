// const Expert = require("../models/Expert");
const Article = require("../models/Article");
const Expert = require("../models/Expert");
const Comment = require("../models/Comment");
const User = require("../models/User");

const postArticle = async(req,res)=>{
    try{
        const expert = await Expert.findOne({user_id:req.user.user_id})
        if(expert){
        let {title, description, tags} = req.body;
        tags = tags.split(",");
        const date = Date.now();
        const article = await Article.create({
            title,description,tags,createdAt:date,
            creator:req.user.user_id
        })
        res.send({article});
    }else{
        res.send("only experts can post articles")
    }
    }catch(err){
        res.send({"Error":err.message});
    }
}

const getArticles = async(req,res)=>{
    try{
        const articles = await Article.find();
        res.send({articles});
    }catch(err){
        res.send({"Error":err.message});
    }
}

const getArticle = async(req,res)=>{
    try{
        const article = await Article.findById(req.params.postId);
        res.json(article);
    }catch(err){
        res.send({"Error":err.message});
    }
}

const likeArticle = async(req,res)=>{
    try{
        const articles = await Article.findOne({_id:req.params.postId});
        if(articles.likes.indexOf(req.user.user_id)===-1)
            articles.likes.push(req.user.user_id);
        await articles.save();
        res.send({articles});
    }catch(err){
        res.send({"Error":err.message});
    }
}

const unlikeArticle = async(req,res)=>{
    try{
        const articles = await Article.findOne({_id:req.params.postId});
        articles.likes = articles.likes.filter(e=>e!==req.user.user_id);
        await articles.save();
        res.send({articles});
    }catch(err){
        res.send({"Error":err.message});
    }
}
//650abe7743975ac96e78e2b0
const searchArticle = async(req,res)=>{
    try{
        let articles = [];
        const searchTerm = req.params.searchTerm;
        articles = articles.concat(await Article.find({title:{$regex:searchTerm,$options:"i"}}));
        articles = articles.concat(await Article.find({description:{$regex:searchTerm,$options:"i"}}));
        articles = articles.concat(await Article.find({tags:{$elemMatch:{$regex:searchTerm,$options:"i"}}}));
        for(let i=0;i<articles.length;i++){
            for(let j=i+1;j<articles.length;j++){
                if(String(articles[i]._id)==String(articles[j]._id)){
                    articles.splice(j,1);
                    j--;
                }
            }
        }
        res.send(articles);
    }catch(err){
        res.send({myErr:true,"Error":err.message});
    }
}

const newComment = async (req, res) => {
    try {
      const user = await User.findById(req.user.user_id);
      const post = await Article.findById(req.params.postId);
      let type = user.userType;
      if (post?.creator === req.user.user_id) {
        type = 'Creator'
      }
      const comment = await Comment.create({
        message: req.body.message,
        type: type,
        creator: req.user.user_id,
        createdAt: Date.now(),
      });
      post?.comments.push(comment._id);
      await post.save()
      res.json(comment).status(200);
    }
    catch (e) {
      res.send({ "Error": e.message });
    }
  };

const getComments = async (req, res) => {
    try {
      const post = await Article.findById(req.params.postId);
      const commentIds = post.comments;
      const comments = await Comment.find({ _id: { $in: commentIds } });
      comments.sort((a, b) => {
        const order = { creator: 1, expert: 2, normal: 3 };
        return order[a.type] - order[b.type];
      });
      res.json(comments);
    }
    catch (e) {
      res.send({ "Error": e.message });
    }
  
  };

module.exports.postArticle = postArticle;
module.exports.getArticles = getArticles;
module.exports.newComment = newComment;
module.exports.getArticle = getArticle;
module.exports.getComments = getComments;
module.exports.likeArticle = likeArticle;
module.exports.unlikeArticle = unlikeArticle;
module.exports.searchArticle = searchArticle;