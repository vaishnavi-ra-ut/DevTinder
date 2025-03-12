const express = require("express");

const app = express();

app.use((req, res) => {
    res.send("Helloooo!");
})

app.listen(3000 , ()=>{
    console.log("Server is litening on port 3000...")
});