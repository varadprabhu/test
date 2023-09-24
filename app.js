const connect = require("./db");
connect();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
require("dotenv").config();
const port = process.env.PORT | 3000;
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.get("/",(req,res)=>{
    res.send("WELCOME TO VRUKSHAA!!!");
})
app.use(cors());
app.use("/auth",require("./routes/auth"));
app.use("/post",require("./routes/post"));
app.use("/article",require("./routes/article"));
app.use("/comment",require("./routes/comment"));
app.use("/profile",require("./routes/profile"));
app.listen(port,()=>{
    console.log(`Server is running at http://127.0.0.1:${port}`)
})