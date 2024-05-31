const Email = require("./../utils/email")
const Ad = require("./../models/adModel")


exports.sendCodeEmail = async (req, res) => {
    console.log(req.body);
    const data = {
        name: req.body.name || "",
        to: req.body.email || "",
        code: req.body.code || "",
        //const url = `${req.protocol}://${req.get("host")}/update/verify`
        url: `${req.get("origin")}/update/verify`
    }
    


    try {
        await new Email(data).sendCode();
        res.status(200).json({
            status: "success",
            message: "Code sent to email",
        })
    } catch(err) {
        res.status(404).json({
            status: "fail",
            message: err
        })
    }

}


exports.sendContactEmail = async (req, res) => {


    // Get E-Mailadress from ad - is not sent via normal get request because in schema "select" is set to false
    try {
        const ad = await Ad.findById(req.body.adId).select("-name -message -style -instrument -image -canton -createdAt -lastUpdatedAt +email");
        const data = {
            contactName: req.body.formName || "",
            contactEmail: req.body.formEmail || "",
            contactMessage: req.body.formMessage || "",
            to: ad.email
        }


        await new Email(data).sendContact();

        res.status(200).json({
            status: "success",
            message: "Contact email sent",
        })

    } catch (err) {
        res.status(404).json({
            status: "fail",
            message: err
        })
    }
}