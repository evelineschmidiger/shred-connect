const path = require ("path");
const express = require("express");
const dotenv = require("dotenv");
dotenv.config({path: "./config.env"}) // process.env.NODE-ENV === "development"
const mongoose = require("mongoose");
const adRouter = require("./routes/adRoutes");
const cors = require("cors");


// Connect to DB
const DB = process.env.DATABASE.replace("<PASSWORD>", process.env.DATABASE_PASSWORD)
const mongooseConnect = async () => {
    try {
        await mongoose.connect(DB);
        console.log("DB connection successful");
    } catch (error) {
    console.error(error);
    }
}
mongooseConnect();
// Handle errors after initial connection was established
mongoose.connection.on('error', err => {
    console.error;("mongoose.connection.on-error:", err);
});


const app = express();

// Serves static files 127.0.0.1:7777/index.html
app.use(express.static(path.join(__dirname, "public")));

//app.use(cors({origin: 'http://localhost:5173', credentials: true, exposedHeaders: ['Set-Cookie', 'Date', 'ETag']}))
//app.use(cors({origin: 'http://localhost:5173', credentials: true, exposedHeaders: ['Set-Cookie', 'Date', 'ETag']}))
//app.use(cors({origin: 'https://shred-connect-frontend-1.onrender.com/', credentials: true, exposedHeaders: ['Set-Cookie', 'Date', 'ETag']}))
app.use(cors({
    "origin": "*",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    "optionsSuccessStatus": 204
}))


// Middleware - ads body data to request object
app.use(express.json());



// Example Middleware - NOT necessary
// Route not specified - applied to every request 
// (as long as not placed after specific route handler that sends response back (ends request-response cycle))
app.use((req, res, next) => {
    // gives information when the request happened
    req.requestTime = new Date().toISOString();
    next();
});

// Mounting the router
app.use("/api/adverts", adRouter);


// Server
const port = process.env.PORT || 7777;
const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});


// socket.io
const io = require("socket.io")(server, {
    cors: { origin: '*'}
});

io.on("connection", (socket) => {
    console.log("socket connected");

    socket.on("created", (ad) => {
        socket.broadcast.emit("created", ad);
    })
    socket.on("updated", (ad) => {
        socket.broadcast.emit("updated", ad);
    })

})