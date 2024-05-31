const path = require ("path");
const express = require("express");
const dotenv = require("dotenv");
dotenv.config({path: "./config.env"}) // process.env.NODE-ENV === "development"
const mongoose = require("mongoose");
const adRouter = require("./routes/adRoutes");
const cors = require("cors");

// Connect to DB
const DB = process.env.DATABASE.replace("<PASSWORD>", process.env.DATABASE_PASSWORD)
mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then(con => console.log("DB connection successful!"))


const app = express();

// NECESSARY??
// define view engine to use pug -templates
/* app.set("view engine", "pug");
// require "path" (not installed, just usable)
app.set("views", path.join(__dirname, "views")) */

// Serves static files 127.0.0.1:7777/index.html
app.use(express.static(path.join(__dirname, "public")));

app.use(cors({origin: 'http://localhost:5173', credentials: true, exposedHeaders: ['Set-Cookie', 'Date', 'ETag']}))


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
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});