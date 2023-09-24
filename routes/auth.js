const express = require("express");
const routes = express.Router();
const {body} = require("express-validator");
const {createUser,verifyExpert,getUser,getSelf}=require("../controllers/auth");
const fetchuser = require("../middlewares/fetchuser");

routes.post("/",createUser)

routes.post("/verify",fetchuser,[
    body("uid","uid should of minimum 12 digit(Aadhar Card)!!!").isLength({min:10}),
    body("email","Please Enter A Valid Email").isEmail(),
],verifyExpert)

routes.get("/",fetchuser,getSelf);
routes.get("/:id",getUser);

module.exports = routes;