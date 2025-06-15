const express = require("express");
const userRouter = express.Router(); 
const userAuth = require("../middlewares/userAuth");
const ConnectionRequest = require("../models/connectionRequest");

//Get all the pending connection requests for the loggedin user
userRouter.get("/user/pendingRequests",userAuth , async (req, res) => {
    try{
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequest.find({
            toOtherUserId : loggedInUser._id,
            status: "interested"
        }).populate("fromOurUserId",["firstName", "lastName" , "gender" , "about" , "skills"]);

        res.status(200).json({
            message: "Pending connection requests fetched successfully",
            data : connectionRequests
        })
    }catch(err){
        res.status(400).send("Something went wrong");
    }
})

userRouter.get("/user/connections" , userAuth , async (req, res) => {
    try{
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequest.find({
            $or : [
                { fromOurUserId: loggedInUser._id , status : "accepted" },
                { toOtherUserId: loggedInUser._id , status : "accepted" }
            ],
        })
        .populate("fromOurUserId", "firstName lastName email") 
        .populate("toOtherUserId", "firstName lastName email");

        const data = connectionRequests.map((row) => {
            if(row.fromOurUserId._id.toString() === loggedInUser._id.toString()){
                return {
                    _id: row._id,
                    user: row.toOtherUserId,
                    status: row.status
                }
            }else{
                return {
                    _id: row._id,
                    user: row.fromOurUserId,
                    status: row.status
                }
            }
        })

        res.status(200).json({ data })
    
    }catch(err){
        res.status(400).send("Something went wrong");
    }
})

module.exports = userRouter;