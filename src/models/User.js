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
        default : "data:image/png;base64,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"
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
