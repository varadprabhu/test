const User = require("../models/User");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const Expert = require("../models/Expert");
const {PythonShell} = require("python-shell");

const predict = async(file,options)=>{
  const response = await PythonShell.run(file,options);
  return response;
}
const newPost = async (req, res) => {
  try {
    const { img, description } = req.body;
    const user = req.user.user_id;
    let disease = (await predict(__dirname+"/main.py",{args:[img]}));
    const analysis = [{
      crop:disease[disease.length-2],
      disease:disease[disease.length-1],
      solution:[diseaseSolutionPair[disease[disease.length-1]][0]]
    }]
    const post = new Post({
      img,
      description,
      createdAt: Date.now(),
      creator: user,
      analysis
    });
    await post.save();
    res.send({ post });
  } catch (e) {
    res.send({ "Error": e.message });
  }
};
const newPostTemp = async (req, res) => {
  try {
    const { img, description } = req.body;
    const user = req.user.user_id;
    let disease = (await predict(__dirname+"/main.py",{args:[img]}))[0];
    const analysis = [{
      disease,solution:[]
    }]
    const post = new Post({
      img,
      description,
      createdAt: Date.now(),
      creator: user,
      analysis
    });
    await post.save();
    res.send({ post });
  } catch (e) {
    res.send({ "Error": e.message });
  }
};

const findPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.json(post);
  } catch (e) {
    res.send({ "Error": e.message });
  }
};

const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()//.sort({ "likes.length": 1 }).exec();
    res.json(posts);
  } catch (e) {
    res.send({ "Error": e.message });
  }
};

const getMyPosts = async (req, res) => {
  try {
    const posts = await Post.find({ creator: req.user.user_id })//.sort({ "likes.length": 1 }).exec();
    res.json(posts);
  } catch (e) {
    res.send({ "Error": e.message });
  }
};

const filterPosts = async (req, res) => {
  try {
    const posts = await Post.find({
      $or: [{ description: word }, { tags: word }],
    });

    posts.sort((a, b) => b.likes.length - a.likes.length);

    res.json(posts);
  }
  catch (e) {
    res.send({ "Error": e.message });
  }
};

const deletePost = async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.id });
    if (req.user.user_id === post.creator) {
      await Post.findByIdAndDelete(req.params.id);
      res.send("post deleted successfully!!!");
    }
    else {
      res.send("post can't able to delete");
    }
  }
  catch (e) {
    res.send({ "Error": e.message });
  }
};

const likePost = async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.id });
    if (post.likes.indexOf(req.user.user_id) === -1)
      post.likes.push(req.user.user_id);
    post.save();
    res.send(post);
  }
  catch (e) {
    res.send({ "Error": e.message });
  }
};

const dislikePost = async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.id });
    post.likes = post.likes.filter((user) => user != req.user.user_id);
    await post.save();
    res.send(post);
  }
  catch (e) {
    res.send({ "Error": e.message });
  }
};

const newComment = async (req, res) => {
  try {
    const user = await User.findById(req.user.user_id);
    const post = await Post.findById(req.params.id);
    let type = user.userType;
    if (post.creator === req.user.user_id) {
      type = 'Creator'
    }
    const comment = await Comment.create({
      message: req.body.message,
      type: type,
      creator: req.user.user_id,
      createdAt: Date.now(),
    });
    post.comments.push(comment._id);
    const savedPost = await post.save()
    res.json(comment).status(200);
  }
  catch (e) {
    res.send({ "Error": e.message });
  }
};

const getComments = async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.id });
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

const approvePost = async (req, res) => {
  try {
    const id = req.user.user_id;
    const expert = await Expert.findOne({user_id:id})
    if (expert) {
      const post = await Post.findOne({ _id: req.params.id });
      if (expert.reviews.indexOf(post._id) === -1)
        post.reviews.approved.push(id);
      expert.reviews.push(post._id)
      await expert.save()
      await post.save();
      res.send(post);
    } else {
      res.send('only experts can review posts')
    }
  }
  catch (e) {
    res.send({ "Error": e.message });
  }
};

const disapprovePost = async (req, res) => {
  try {
    const id = req.user.user_id;
    const expert = await Expert.findOne({user_id:id})
    if (expert) {
      const post = await Post.findOne({ _id: req.params.id });
      if (expert.reviews.indexOf(post._id) === -1)
        post.reviews.disapproved.push(id);
      expert.reviews.push(post._id)
      await expert.save()
      await post.save();
      res.send(post);
    }
  }
  catch (e) {
    res.send({ "Error": e.message });
  }
};

module.exports.newPost = newPost;
module.exports.newPostTemp = newPostTemp;
module.exports.findPost = findPost;
module.exports.getPosts = getPosts;
module.exports.filterPosts = filterPosts;
module.exports.deletePost = deletePost;
module.exports.likePost = likePost;
module.exports.dislikePost = dislikePost;
module.exports.newComment = newComment;
module.exports.getComments = getComments;
module.exports.approvePost = approvePost;
module.exports.disapprovePost = disapprovePost;

