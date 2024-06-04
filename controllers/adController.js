const Ad = require("./../models/adModel")
const APIFeatures = require("./../utils/apiFeatures")



exports.getAllAds = async (req, res) => {
    try {

        // Execute a very long Query like: query.sort().select().skip().limit()...
        // create instance of APIFeatures, call each method which returns "this"
        const featuresWithoutPaginate = new APIFeatures(Ad.find(), req.query).filter().sort().limitFields();
        const lengthWithoutPaginate = (await featuresWithoutPaginate.query).length;

        const features = new APIFeatures(Ad.find(), req.query).filter().sort().limitFields().paginate();
        //console.log(features.queryString);
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


