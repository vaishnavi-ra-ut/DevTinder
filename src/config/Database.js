const mongoose = require("mongoose")

const connectDB = async() =>{
    await mongoose.connect("mongodb+srv://rautvaishnavi29:diya2580raut@namastenode.2isix.mongodb.net/DevTinder");
};

module.exports = connectDB;
