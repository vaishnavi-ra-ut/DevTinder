const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    firstName : {
        type : String,
        required : true,
        index : true,
    }, 
    lastName : {
        type : String
    },
    emailId : {
        type : String , 
        required : true, 
        unique : true ,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error ("Wrong syntax of Email" + value);
            }
        }
    },
    age : {
        type : Number
    },
    gender : {
        type : String , 
        validate(value){
            if(!["Male" , "Female" , "Others"].includes(value)){
                throw new Error ("Gender data not valid");
            }
        }
    },
    password : {
        type : String ,
        required : true
    },
    about : {
        type : String , 
        default : "This a default about."
    },
    skills : {
        type: [String] 
    },
    photoURL : {
        type : String,
        default : "https://www.shutterstock.com/image-vector/default-avatar-profile-icon-transparent-600nw-2463868853.jpg"
    },
});

userSchema.methods.getJWT = async function() {
    const user = this;

    const token = await jwt.sign({_id : user._id} , "Diya@123" , {expiresIn : "7d",});

    return token;
}

userSchema.methods.validatePass = async function(passwordInputByUser) {
    const user = this;
    const passHash = user.password;

    const isPassValid = await bcrypt.compare( passwordInputByUser , passHash);
    
    return isPassValid;
}

module.exports = mongoose.model("User", userSchema);

// This code defines a Mongoose schema for a User model, including methods for generating JWTs and validating passwords.
// It uses bcrypt for password hashing and validation  
