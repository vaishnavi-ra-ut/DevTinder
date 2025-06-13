const express = require('express');
const requestRouter = express.Router();
const userAuth = require("../middlewares/userAuth");
const ConnectionRequestModel = require("../models/connectionRequest");
const User = require('../models/User');

requestRouter.post("/request/send/:status/:toOtherUserId", userAuth, async (req, res) => {
    try {
        const fromOurUserId = req.user._id;
        const toOtherUserId = req.params.toOtherUserId;
        const status = req.params.status;

        const allowed = ["ignored" , "interested"];
        if (!allowed.includes(status)){
            return res.status(400).send("Invalid status provided");
        }

        // Check if the user to whom the request is being sent exists
        const checkToUserId = await User.findById(toOtherUserId);
        if(!checkToUserId) {
            return res.status(404).send("User to whom the request is being sent does not exist");
        }; 

        // Check if there is an exisiting connectionRequest
        const existingRequest = await ConnectionRequestModel.findOne({
            $or: [
                { fromOurUserId, toOtherUserId },
                { fromOurUserId: toOtherUserId, toOtherUserId: fromOurUserId }
            ]});
            if (existingRequest) {
                return res.status(400).send("Connection request already exists");
            }

        const connectionRequest = new ConnectionRequestModel({
            fromOurUserId,
            toOtherUserId,
            status
        });

        const data = await connectionRequest.save();
        res.json({
            message: "Connection request sent successfully",
            data,
        });

    } catch (err) {
        console.error("Error in sending connection request:", err);
        res.status(400).send("Something went wrong while sending the request");
    }
});

module.exports = requestRouter;
