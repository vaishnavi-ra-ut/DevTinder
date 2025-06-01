const mongoose = require("mongoose")
const validator = require("validator")

const userSchema = new mongoose.Schema({
    firstName : {
        type : String,
        required : true
    }, 
    lastName : {
        type : String
    },
    emailId : {
        type : String , 
        required : true, 
        unique : true ,
        validatr(value){
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
            if(!["male" , "female" , "others"].includes(value)){
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
        type : String   
    }
    });

module.exports = mongoose.model("User", userSchema);
