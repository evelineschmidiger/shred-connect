const mongoose = require("mongoose");

const adSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, "An ad must have a name"],
    },
    message: {
        type: String,
        trim: true,
        required: [true, "An ad must have a message"]
    },
    style: {
        // If empty: default [], or set: default: undefined
        // should i make that there needs to be a minimum 1?
        type: [String],
        required: [true, "An ad must have minimum one style"]
    },
    instrument: {
        // If empty: default [], or set: default: undefined
        // should i make that there needs to be a minimum 1?
        type: [String],
        required: [true, "An ad must have minimum one instrument"]
    },
    canton: {
        type: String,
        required: [true, "An ad must have a canton"],
    },
    code: {
        type: String,
        required: false,
        // select: false -> not returned in projection
        select: false
        // unique: true
    },
    email: {
        type: String,
        trim: true,
        required: [true, "An ad must have an email-address"],
        select: false
    },
    image: {
        type: String,
        trim: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        required: true,
    },
    lastUpdatedAt: {
        type: Date,
        default: Date.now,
    },
    views: {
        type: Number
    }
})
// Mongoose Docuement Middleware to create 6-digit-code - runs before .save() and .create()
adSchema.pre("save", function(next) {
    // options.validateBeforeSave = false;
    // how to have "required true" in schema when code is generated in middleware?
    let numberArray = []
    for (let i = 0; i < 6; i++) {
        let number = (Math.floor(Math.random() * 10)).toString();
        numberArray.push(number);
      }

    this.code = numberArray.join("")
    next();
})


// create the Ad-Model
const Ad = mongoose.model("Ad", adSchema);

module.exports = Ad;
