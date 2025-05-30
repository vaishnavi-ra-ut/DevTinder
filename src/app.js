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
