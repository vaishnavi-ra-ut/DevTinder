const jwt = require("jsonwebtoken");
const User = require("../models/User");

const userAuth = async (req , res , next) =>{
    // Read the token fron the request cookies 
    try{ 
        const {token} = req.cookies;
        if(!token){
            throw new Error ("Token is not valid !");
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
