const jwt = require("jsonwebtoken");
const Ad = require("./../models/adModel")
const APIFeatures = require("./../utils/apiFeatures")

// code and email needs to be sent in request body
// Todo: set secretKey in config.env
exports.createToken = (req, res) => {
    // verify code & e-mail - see if match

    // payload: 
    const advert = {
        id: 4,
        code: "083628",
        email: "franz.huber@gmail.com",
    };
    jwt.sign({advert: advert}, "secretkey", {expiresIn: "3h"}, (err, token) => {
        // cookie setzen
        res.json({
            token: token
        });
    });
}
// verify Token - Format of Token: Bearer
// Authorization: Bearer <access_token>
exports.setToken = (req, res, next) => {
    // Get auth header value
    const bearerHeader = req.headers["authorization"];
    // Check if bearer is undefined
    if (typeof bearerHeader !== "undefined") {
        // Split at the Space
        // .split(): turns string into an array (here by space)
        const bearer = bearerHeader.split(" ");
        // Get token from array
        const bearerToken = bearer[1];
        // Set the token
        req.token = bearerToken;
        // Next middleware
        next();

    } else {
        // Forbidden
        res.sendStatus(403);
    }

}

exports.verifyToken = (req, res, next) => {
    jwt.verify(req.token, "secretkey", (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            next();
        }
    });
}

exports.getAllAds = async (req, res) => {
    try {
        console.log(req.query);

        if (req.query.instrument === "Andere") console.log("Andere");
        // Execute a very long Query like: query.sort().select().skip().limit()...
        // create instance of APIFeatures, call each method which returns "this"
        const featuresWithoutPaginate = new APIFeatures(Ad.find(), req.query).filter().sort().limitFields();
        const lengthWithoutPaginate = (await featuresWithoutPaginate.query).length;

        const features = new APIFeatures(Ad.find(), req.query).filter().sort().limitFields().paginate();
        const ads = await features.query;

        res.status(200).json({
            status: "success",
            results: ads.length,
            data: {
                ads,
                lengthWithoutPaginate
            }
        })
    } catch (err) {
        res.status(404).json({
            status: "fail",
            message: err
        })
    }
}
exports.getAd = async (req, res) => {
    try {
        const ad = await Ad.findById(req.params.id);

        res.status(200).json({
            status: "success",
            data: {
                ad
            }
        })

    } catch (err) {
        res.status(404).json({
            status: "fail",
            message: err
        })
    }
}
exports.createAd = async (req, res) => {
    try {
        // const newAd = new Ad({})
        // newAD.save() // = Mongoose-Documentation: Model.prototype.save() --- save()-method called on the document (instance), not on Ad-Class
        const newAd = await Ad.create(req.body);
        res.status(201).json({
            status: "success",
            data: {
                ad: newAd
            }
        })
    } catch (err) {
        res.status(400).json({
            status: "fail",
            message: err
        })
    }
} 
exports.updateAd = async (req, res) => {
    try {
        newReqBody = {...req.body};
        newReqBody.lastUpdatedAt = Date.now();
        // 3. param: Object with options
        const ad = await Ad.findByIdAndUpdate(req.params.id, newReqBody, {
            // return the new, updated document
            new: true,
            runValidators: true,
        })
        res.status(200).json({
            status: "success",
            data: {
                ad
            }
        })
    } catch (err) {
        res.status(404).json({
            status: "fail",
            message: err
        })
    }

}
exports.deleteAd = async (req, res) => {
    try {
        await Ad.findByIdAndDelete(req.params.id);
        res.status(204).json({
            status: "success",
            data: null
        })
    } catch (err) {
        res.status(404).json({
            status: "fail",
            message: err
        })
    }
}