const mongoose = require("mongoose");
const comment = mongoose.Schema({
    message: {
        type: String,
        require: true
    },
    type: {
        type: String,//(expert / farmer / creator)
        require: true
    },
    likes: [String], //ids of people liking the comments
    creator: String, //id of the person who has commented
    createdAt:Date
})

module.exports = mongoose.model("comment", comment);