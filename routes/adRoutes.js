const express = require("express");
const adController = require("./../controllers/adController")
const emailController = require("./../controllers/emailController")
const router = express.Router();


router
    .route("/")
    .get(adController.getAllAds)
    .post(adController.createAd);

router
    .route("/:id")
    .get(adController.getAd)
    .patch(adController.updateAd)
    .delete(adController.deleteAd);

router
    .route("/:id/contact")
    .post(emailController.sendContactEmail)

router
    .route("/sendCode")
    .post(emailController.sendCodeEmail);


module.exports = router;