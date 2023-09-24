const mongoose = require("mongoose");
const expert = mongoose.Schema({
    user_id:{
        type:String,
        require:true
    },
    name:{
        type:String,
        require:true
    },
    details:{
        uid:String,
        email:String,
        expertise:String,
        qualification:String,
        experience:String
    },
    reviews: [String],
    articles: [String],//ids of articles posted by the user
    createdAt: Date
})

module.exports = mongoose.model("expert",expert);