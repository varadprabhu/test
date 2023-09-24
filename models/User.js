const mongoose = require("mongoose");
const user = mongoose.Schema({
    uid:{
        type:String,//Unique Identification Number of firebase
        require:true
    },
    info: {
        type: Object,//firebase user object
        require: true
    },
    posts: [String],//ids of post posted by the user
    userType:{
        type:String,
        default:"None"
    },
    createdAt: Date
})

module.exports = mongoose.model("user",user);