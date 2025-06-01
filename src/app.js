const express = require("express");
const connectDB = require("./config/Database");
const app = express();
const User = require("./models/User")

app.use(express.json()); 

app.post("/signup", async (req , res) => {
    const user = new User(req.body);

    await user.save();
    res.send("User added Succesfully!");;
})

// feeds/gets all the data from the database 
app.get("/user" , async (req , res) =>{
  const userEmail = req.body.emailId ;
  try{
   const user =  await User.find({ emailId : userEmail});
    res.send(user);
  
  } 
  catch(err){
    res.status(400).send("Somthing went wrong");
  }
})

// update the data
app.patch("/user" , async (req , res) =>{
  const data = req.body;
  const userId = req.body.userId;
  try{
   await User.findByIdAndUpdate({ _id : userId} , data);
    res.send("User upadated successfully");
  
  } 
  catch(err){
    res.status(400).send("Somthing went wrong");
  }
})

connectDB()
  .then(() => {
    console.log("Database connection established...");

    app.listen(3000, () => {
      console.log("Server is successfully listening on port 3000...");
    });
  })
  .catch((err) => {
    console.error("Database cannot be connected!!", err);
  });
