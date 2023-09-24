const mongoose = require("mongoose");
const post = mongoose.Schema({
    img: {
        type: String,//url
        require: true
    },
    description: String,
    createdAt: Date,
    reviews: {
        approved: [String],
        disapproved: [String]
    },
    creator: String,
    comments: [String],
    likes: [String],
    analysis: [{
        disease: String,
        solution: [String]
    }],
    tags: [String]
});

module.exports = mongoose.model("post", post);