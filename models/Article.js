const mongoose = require("mongoose");
const article = mongoose.Schema({
    creator: String,
    title: { type: String, require: true },
    tags: [String],
    description: String,
    likes: [String],
    comments: [String],
    createdAt: Date
});

module.exports = mongoose.model("article", article);