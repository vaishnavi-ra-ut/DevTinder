const express = require("express");
const userRouter = express.Router(); 
const userAuth = require("../middlewares/userAuth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/User");

//Get all the pending connection requests for the loggedin user
userRouter.get("/user/pendingRequests",userAuth , async (req, res) => {
    try{
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequest.find({
            toOtherUserId : loggedInUser._id,
            status: "interested"
        }).populate("fromOurUserId",["firstName", "lastName" , "gender" , "about" , "skills" , "age" , "photoURL"]);

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
        .populate("fromOurUserId", "firstName lastName email photoURL age gender about skills")
        .populate("toOtherUserId", "firstName lastName email photoURL age gender about skills")


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

userRouter.get("/user/feed" , userAuth , async (req , res) => {
    try{
        const loggedInUser = req.user;
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 30 ? 30 : limit;
        const skip = (page - 1) * limit;

        const connectionRequests = await ConnectionRequest.find({
            $or : [
                { fromOurUserId: loggedInUser._id },
                { toOtherUserId: loggedInUser._id }
            ],
        }).select("fromOurUserId toOtherUserId ").skip(skip).limit(limit);

        const hideUsers = new Set();
        connectionRequests.forEach((requests) => {
            hideUsers.add(requests.fromOurUserId.toString());
            hideUsers.add(requests.toOtherUserId.toString());
        })
        const users = await User.find({
           $and: [
                { _id: { $ne: loggedInUser._id } },
                { _id: { $nin: Array.from(hideUsers) } }
            ]
        })
        res.status(200).json({
            message: "Feed fetched successfully",
            data: users
        })
    }catch(err){
        res.status(400).send("Something went wrong");
    } 
})

module.exports = userRouter;