const express = require("express");
const authRouter = express.Router();
const User = require("../models/User")
const bcrypt = require("bcrypt");
const { validateSignUp } = require("../helpers/validation");

authRouter.post("/signup", async (req , res) => {
  try{
    validateSignUp(req);

    const {firstName , lastName , emailId , password , age , gender , skills , photoURL} = req.body;
    const passwordHash = await bcrypt.hash(password , 10)

    const user = new User({
      firstName , lastName , emailId , password : passwordHash , age , gender , skills , photoURL , about
    });
    await user.save();
    res.send("User added Succesfully!");
  
  }
  catch(err){
    res.send("ERROR : " + err.message);
  }
})

authRouter.post("/login" , async (req , res) => {
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
      
      res.send(user);
    } 
    else{
      throw new Error("Wrong Password");
    }
  }
  catch(err){
    res.status(400).send(err.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token" , null, {
    expires: new Date(Date.now())
  });  
  res.send("Logout Successfull !");
});



module.exports = authRouter;