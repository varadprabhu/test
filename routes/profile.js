const express= require("express");
const routes = express.Router();
const {getUser} = require("../controllers/profile");
const fetchuser = require("../middlewares/fetchuser");

routes.get("/",fetchuser,getUser);

module.exports = routes