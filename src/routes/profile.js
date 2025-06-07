const express = require('express');
const profileRouter = express.Router();
const userAuth = require("../middlewares/userAuth");
const { validateEditProfile } = require("../helpers/validation");


profileRouter.get("/profile/view" , userAuth , async (req , res) => {
  try{
    const user = req.user;
    res.send(user);
  }catch(err){
    res.status(400).send("ERROR : " + err.message);
  }                                                                 
});

profileRouter.patch("/profile/edit" , userAuth , async (req , res) => {
  try{
    if (validateEditProfile(req)){
      throw new Error("Invalid fields for update");
    }
    const loggdInUser = req.user;
    
    Object.keys(req.body).forEach((key) => {
      loggdInUser[key] = req.body[key];
    });

    await loggdInUser.save();

  }catch(err){
      return res.status(400).send("ERROR : " + err.message);
  }

});

module.exports = profileRouter;