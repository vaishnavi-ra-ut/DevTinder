const express = require('express');
const requestRouter = express.Router();
const userAuth = require("../middlewares/userAuth");

requestRouter.post("/sendConnectionRequest", userAuth , async (req, res) => {
    const user= req.user;
    console.log("Sending a connection request");
    res.send(user.firstName + " " + user.lastName + " has sent you a connection request.");
});

module.exports = requestRouter;