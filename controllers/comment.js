const Comment =  require("../models/Comment");

const likeComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (comment.likes.indexOf(req.user.user_id) === -1)
      comment.likes.push(req.user.user_id);
  await comment.save();
  res.send("success").status(200)
  } catch (error) {
    res.json(error).status(400)
  }
};

const dislikeComment = async (req, res) => {
  try {
    
  const comment = await Comment.findById(req.params.id);
  
  comment.likes = comment.likes.filter((like) => like !== req.user.user_id);
  await comment.save();
  res.send('success')
  } catch (error) {
    res.send(error).status(400)
  }
};


module.exports.likeComment = likeComment;
module.exports.dislikeComment = dislikeComment;
