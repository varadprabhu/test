const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const fetchuser = async(req,res,next)=>{
    try{
        const authToken = req.header("authToken");
        if(!authToken){
            return res.status(401).send("Please Enter a Valid authToken");
        }
        const user = await jwt.verify(authToken,JWT_SECRET);
        req.user = user;
        next();
    }catch(err){
        return res.status(400).send(err.message);
    }
}

module.exports = fetchuser;