const jwt = require("jsonwebtoken");
const User = require("../models/User");

const userAuth = async (req , res , next) =>{
    if (req.method === "OPTIONS") {
    return next();
  }
    // Read the token fron the request cookies 
    try{ 
        const {token} = req.cookies;
        if(!token){
            return res.status(401).send("Please login first");
        }

        // Validate the the token 
        const decode = await jwt.verify(token , "Diya@123")
        const {_id} = decode;
        
        // Find the user 
        const user = await User.findById(_id);
        if(!user){
            throw new Error ("User not found");
        } 
        req.user = user;    
        next();
    } 
    catch(err) {
        res.status(400).send("ERROR : " + err.message);
    }


};

module.exports = userAuth; 
