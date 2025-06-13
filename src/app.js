const express = require("express");
const connectDB = require("./config/Database");
const app = express();
const User = require("./models/User")
const cookieParser = require("cookie-parser")
const jwt = require("jsonwebtoken");

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/requests");

app.use(express.json()); 
app.use(cookieParser());

app.use("/" , authRouter);
app.use("" , profileRouter);
app.use("/" , requestRouter);    

// feeds/gets all the data from the database 
app.get("/user" , async (req , res) =>{
  const userEmail = req.body.emailId ;
  try{
   const user =  await User.find({ emailId : userEmail});
    res.send(user);
  
  } 
  catch(err){
    res.status(400).send("Somthing went wrong");
  }
})

// update the data
app.patch("/user/:userId" , async (req , res) =>{
  const userId = req.params?.userId;
  const data = req.body;

  try{
    const ALLOWED = ["about" , "gender" , "skills"]
    const isAllowed = Object.keys(data).every(k => ALLOWED.includes(k));

    if(!isAllowed){
      throw new Error ("Update not allowed");
    }

   await User.findByIdAndUpdate({ _id : userId} , data);
    res.send("User updated successfully");

  } 
  catch(err){
    res.status(400).send("Update Failed : " + err.message);
  }
})

connectDB()
  .then(() => {
    console.log("Database connection established...");

    app.listen(3000, () => {
      console.log("Server is successfully listening on port 3000...");
    });
  })
  .catch((err) => {
    console.error("Database cannot be connected!!", err);
  });
