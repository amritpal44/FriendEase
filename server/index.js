const cookieParser = require("cookie-parser");
const cors = require("cors");
const database = require("./config/database");
const dotenv = require("dotenv");
const { auth } = require("./middleware/auth");


const express = require("express");
const app  = express();


const userRoutes = require("./routes/userRoutes");
const friendshipRoutes = require("./routes/friendshipRoutes");
const searchUserRoutes = require("./routes/searchRoutes");

app.use( express.json() );
app.use( cookieParser() );
app.use(cors({
    origin: "http://localhost:3000", 
    credentials: true
}));

app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/friendship", friendshipRoutes);
app.use("/api/v1/search", searchUserRoutes);



app.post("/", auth, (req, res) => {
    return res.json({
        success: true,
        message: "Server is up and running."
    })
})

dotenv.config();
const PORT = process.env.PORT;

database.connect();

app.listen(PORT, ()=>{
    console.log(`Server started at port: ${PORT}`);
})