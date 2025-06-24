const express = require('express');
const profileRouter = express.Router();
const userAuth = require("../middlewares/userAuth");
const { validateEditProfile } = require("../helpers/validation");


profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }                                                                 
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    // 🔍 Add these logs to debug req.body
    console.log("typeof req.body:", typeof req.body);
    console.log("req.body raw:", req.body);
    console.log("Object.keys(req.body):", Object.keys(req.body));

    // This runs your validation logic
    validateEditProfile(req);

    const loggedInUser = req.user;

    Object.keys(req.body).forEach((key) => {
      loggedInUser[key] = req.body[key];
    });

    await loggedInUser.save();
    res.send("Profile updated successfully");

  } catch (err) {
    return res.status(400).send("ERROR : " + err.message);
  }
});



module.exports = profileRouter;
