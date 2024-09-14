const cookieParser = require("cookie-parser");
const cors = require("cors");
const dotenv = require("dotenv");


const express = require("express");
const app  = express();

app.use( express.json() );
app.use( cookieParser() );
app.use( cors({}) );


app.get("/", (req, res) => {
    return res.json({
        success: true,
        message: "Server is up and running."
    })
})

dotenv.config();
const PORT = process.env.PORT;

app.listen(PORT, ()=>{
    console.log(`Server started at port: ${PORT}`);
})