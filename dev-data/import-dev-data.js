const dotenv = require("dotenv"); // environment variables
const mongoose = require("mongoose");
const fs = require("fs");
const Ad = require("./../models/adModel")

dotenv.config({path: "./config.env"}) // process.env.NODE-ENV === "development"

const DB = process.env.DATABASE.replace("<PASSWORD>", process.env.DATABASE_PASSWORD)

mongoose.connect(DB).then(con => console.log("DB connection successful!"))

const ads = JSON.parse(fs.readFileSync(`${__dirname}/adverts.json`, "utf-8"));

const importData = async () => {
    try {
        await Ad.create(ads);
        console.log("Data successfully loaded!");
    } catch (err) {
        console.log(err);
    }
}

// DELETE ALL DATA FROM COLLECTION

const deleteData = async() => {
    try {
        await Ad.deleteMany();
        console.log("Data successfully deleted!");
        process.exit();
    } catch (err) {
        console.log(err);
    }
}

// call functions in command line
// process.argv: arguments from command entered
// node dev-data/import-dev-data.js --import
// node dev-data/import-dev-data.js --delete

if(process.argv[2] === "--import") {
    importData();
} else if (process.argv[2] === "--delete") {
    deleteData();
}
