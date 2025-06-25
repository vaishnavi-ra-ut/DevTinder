const express = require("express");
const connectDB = require("./config/Database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const User = require("./models/User");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/requests");
const userRouter = require("./routes/user");

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

app.use((req, res, next) => {
  next();
});

app.use(express.json());
app.use(cookieParser());

// ✅ All route handlers
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

// ✅ Manual PATCH route (if still needed)
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;

  try {
    const ALLOWED = ["about", "gender", "skills", "photoURL"];
    const isAllowed = Object.keys(data).every((k) => ALLOWED.includes(k));

    if (!isAllowed) {
      throw new Error("Update not allowed");
    }

    await User.findByIdAndUpdate({ _id: userId }, data);
    res.send("User updated successfully");
  } catch (err) {
    res.status(400).send("Update Failed : " + err.message);
  }
});

// ✅ Connect to DB and start server
connectDB()
  .then(() => {
    console.log("Database connection established...");
    app.listen(3000, '0.0.0.0', () => {
      console.log("Server is listening on port 3000...");
    });
  })
  .catch((err) => {
    console.error("Database connection failed!!", err);
  });
