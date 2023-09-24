const Article = require("../models/Article");
const Expert = require("../models/Expert");
const Post = require("../models/Post");
const User = require("../models/User")



const getUser = async(req,res)=>{
    try {
        const user = await User.findById(req.user.user_id);
        const expert = await Expert.findOne({user_id: user._id});
        if(expert){
            const reviewArray = await  expert?.reviews
            const posts = await Post.find({_id:{$in: reviewArray}})
            const articles = await Article.find({creator: user._id})
            res.json({posts,articles})
        }
        else{
            const posts = await Post.find({creator:user._id})
            res.json(posts)
        }
        
    } catch (error) {
        console.log(error)
    }
}

module.exports.getUser = getUser;



