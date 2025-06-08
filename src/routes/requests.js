const express = require('express');
const requestRouter = express.Router();
const userAuth = require("../middlewares/userAuth");
const ConnectionRequestModel = require("../models/connectionRequest");

requestRouter.post("/request/send/:status/:toOtherUserId", userAuth, async (req, res) => {
    try {
        const fromOurUserId = req.user._id;
        const toOtherUserId = req.params.toOtherUserId;
        const status = req.params.status;

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
