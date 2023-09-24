const User = require("../models/User");
const Expert = require("../models/Expert");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;

const createUser = async (req, res) => {
    const { uid, providerData } = req.body;
    const date = Date.now();
    try {
        let user = await User.findOne({ uid });
        if (!user) {
            user = await User.create({
                uid,
                info: providerData,
                createdAt: date
            })
        }
        const authToken = jwt.sign({user_id:user._id},JWT_SECRET);
        res.send({ "msg": "Login Successfully",user, authToken });
    } catch (err) {
        res.send({ "Error": err.message });
    }
}

const verifyExpert = async(req,res)=>{
    const error = validationResult(req);
    try{
        let user = await User.findOne({_id:req.user.user_id});
        user.userType = req.body.type;
        await user.save();
        if(req.body.type!=="Normal"){
            if(!error.isEmpty()){
                return res.json({"Error":error.array()})
            }
            const {name, qualification, email, experience,uid, expertise} = req.body;
            let test = await Expert.findOne({user_id:req.user.user_id})
            if(!test){
            const expert = await Expert.create({
                user_id:req.user.user_id,
                name,
                details:{
                    uid,
                    qualification,
                    email,
                    experience,
                    expertise
                },
                createdAt:Date.now()
            })
        }
            res.json(user);
        }else{
            res.json(user);
        }
    }catch(err){
        res.send({"Error":err.message});
    }
}

const getSelf = async(req,res)=>{
    try{
        const user = await User.findOne({_id:req.user.user_id});
        if(user){
            res.send(user);
        }else{
            res.status(404).send("User Not Found!!!");
        }
    }catch(err){
        res.send({"Error":err.message});
    }
}

const getUser = async(req,res)=>{
    try{
        const user = await User.findOne({_id:req.params.id});
        if(user){
            res.send(user);
        }else{
            res.status(404).send("User Not Found!!!");
        }
    }catch(err){
        res.send({"Error":err.message});
    }
}

module.exports.createUser = createUser;
module.exports.verifyExpert = verifyExpert;
module.exports.getUser = getUser;
module.exports.getSelf = getSelf;