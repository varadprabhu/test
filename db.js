const mongoose = require("mongoose");
require("dotenv").config();
const MONGOURI = process.env.MONGOURI 
const connect = ()=>{
    try{
        mongoose.connect(MONGOURI);
        console.log("Connected To Server Successfully!!!")
    }catch(err){
        console.log(err.message);
    }
}
module.exports = connect;