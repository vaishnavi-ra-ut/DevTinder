const express = require("express");
const connectDB = require("./config/Database");
const app = express();
const User = require("./models/User")
const {validateSignUp} = require("./helpers/validators")
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser")
const jwt = require("jsonwebtoken");
const userAuth = require("./middlewares/auth")

app.use(express.json()); 
app.use(cookieParser());

app.post("/signup", async (req , res) => {
  try{
    validateSignUp(req);

    const {firstName , lastName , emailId , password} = req.body;
    const passwordHash = await bcrypt.hash(password , 10)

    const user = new User({
      firstName , lastName , emailId , password : passwordHash ,
    });
    await user.save();
    res.send("User added Succesfully!");
  
  }
  catch(err){
    res.send("ERROR : " + err.message);
  }
})

app.get("/profile" , userAuth , async (req , res) => {
  try{
    const user = req.user;
    res.send(user);
  }catch(err){
    res.status(400).send("ERROR : " + err.message);
  }                                                                 
});

app.post ("/login" , async (req , res) => {
  try{
    const {emailId , password} = req.body;
    const user = await User.findOne({emailId : emailId});
    if(!user){
      throw new Error ("EmailId is not present in DB");
    }

    const isPassValid = await user.validatePass(password);
    if(isPassValid){

      // Create a jwt token - Off-loaded onto user schema
      const token = await user.getJWT();

      // Add token to cookie and send the respond back to the user 
      res.cookie("token" , token);
      
      res.send("Login Successfull !");
    } 
    else{
      throw new Error("Wrong Password");
    }
  }
  catch(err){
    res.status(400).send(err.message);
  }
})

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
