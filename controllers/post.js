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
  const diseaseSolutionPair = {
    "Corn___Common_Rust": [
            "Always consider an integrated approach with preventive measures together with biological treatments if available. The application of fungicides can be beneficial when used on susceptible varieties. Apply a foliar fungicide early in the season if rust is bound to spread rapidly due to the weather conditions. Numerous fungicides are available for rust control. Products containing mancozeb, pyraclostrobin, pyraclostrobin + metconazole, pyraclostrobin + fluxapyroxad, azoxystrobin + propiconazole, trifloxystrobin + prothioconazole can be used to control the disease. An example of treatment could be: Spraying of mancozeb @ 2.5 g/l as soon as pustules appear and repeat at 10 days interval till flowering."
    ],
    "Corn___Gray_Leaf_Spot": [
            "Always consider an integrated approach with preventive measures and biological treatments if available. Fungicides are available to treat this disease (pyraclostrobin, pyraclostrobin + metconazole) but are not normally recommended for its control as they are not economically viable."
    ],
    "Corn___Northern_Leaf_Blight": [
            "Bio-fungicides based on Trichoderma harzianum, or Bacillus subtilis can be applied at different stages to decrease the risk of infection. Application of sulfur solutions is also effective."
    ],
    "Potato___Early_Blight": [
            "Application of products based on Bacillus subtilis or copper-based fungicides registered as organic can treat this disease."
    ],
    "Potato___Late_Blight": [
            "Apply copper-based fungicides before dry weather. Foliar sprays of organic coating agents can also prevent the infection."
    ],
    "Rice___Brown_Spot": [
            "To be sure that the seeds are not contaminated, a seed bath in hot water (53-54°C) for 10 to 12 minutes is recommended. To improve the results, place the seeds for 8 hours in cold water before the hot water treatment."
    ],
    "Rice___Leaf_Blast": [
            "Always consider an integrated approach with preventive measures together with biological treatments if available. Seed treatment with thiram is effective against the disease. Fungicides containing azoxystrobin, or active ingredients of the family of triazoles or strobilurins can also be sprayed at nursery, tillering and panicle emergence stages to control rice blast. One or two fungicide applications at heading can be effective in controlling the disease."
    ],
    "Rice___Neck_Blast": [
            " Avoid excessive nitrogen fertilization and split the applications into two or more treatments."
    ],
    "Wheat___Brown_Rust": [
            "Always consider an integrated approach with preventive measures together with biological treatments if available. Foliar sprays with fungicides containing propiconazole or triazole can be applied preventively to avoid the disease. Carefully read the instructions on how to use the product. Respect application times and doses to avoid the development of resistance."
    ],
    "Wheat___Yellow_Rust": [
            "Many biofungicides are available in the market. Products based on Bacillus pumilus applied at 7 to 14 days intervals are effective against the fungus and are marketed by major actors of the industry."
    ]
    }
  try {
    const { img, description } = req.body;
    const user = req.user.user_id;
    let disease = (await predict(__dirname+"/main.py",{args:[img]}));
    console.log(disease)
    const analysis = [{
      crop:disease[disease.length-2],
      disease:disease[disease.length-1],
      // solution:[diseaseSolutionPair[disease[disease.length-1]][0]]
      solution:['test']
    }]
    const post = new Post({
      img,
      description,
      createdAt: Date.now(),
      creator: user,
      analysis
    });
    await post.save();
    res.send({ post,disease });
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

