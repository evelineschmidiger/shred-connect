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
    // are these asynchronous? probably not, make it async
    // with auth: .patch(adController.setToken, adController.verifyToken, adController.updateAd)
    .patch(adController.updateAd)
    // with auth: .delete(adController.setToken, adController.verifyToken, adController.deleteAd);
    .delete(adController.deleteAd);
router
    .route("/:id/contact")
    .post(emailController.sendContactEmail)

router
    .route("/sendCode")
    .post(emailController.sendCodeEmail);

router
    .route("/token")
    .post(adController.createToken)


module.exports = router;