const nodemailer = require("nodemailer");
const pug = require("pug");
const { convert } = require("html-to-text");


// using sendWelcome method of the class:
// new Email(user, url).sendWelcome();

module.exports = class Email {
    constructor(data) {
        this.to = (process.env.NODE_ENV === "development") ? data.to : "eveline.schmidiger@protonmail.com"
        this.contactName = data.contactName || "";
        this.contactEmail = data.contactEmail || "";
        this.contactMessage = data.contactMessage || "";
        this.code = data.code || "";
        this.url = data.url || "";
        this.from = (process.env.NODE_ENV === "development") ? `Shred-Connect <${process.env.EMAIL_DEVELOPMENT_MAILTRAP_FROM}>` : process.env.EMAIL_PRODUCTION_MAILTRAP_FROM;
    }

    newTransport() {
        if(process.env.NODE_ENV === "production") {
            return nodemailer.createTransport({
                host: process.env.EMAIL_PRODUCTION_MAILTRAP_HOST,
                port: process.env.EMAIL_PRODUCTION_MAILTRAP_PORT,
                auth: {
                  user: process.env.EMAIL_PRODUCTION_MAILTRAP_USERNAME,
                  pass: process.env.EMAIL_PRODUCTION_MAILTRAP_PASSWORD,
                }
            })
        }

        return nodemailer.createTransport({
            host: process.env.EMAIL_DEVELOPMENT_MAILTRAP_HOST,
            port: process.env.EMAIL_DEVELOPMENT_MAILTRAP_PORT,
            auth: {
                user: process.env.EMAIL_DEVELOPMENT_MAILTRAP_USERNAME,
                pass: process.env.EMAIL_DEVELOPMENT_MAILTRAP_PASSWORD
            }
        })
    }

    async send(template, subject) {
        // 1. Render HTML based on a pug template
        const html = pug.renderFile(`${__dirname}/../views/emails/${template}.pug`, {
            contactName: this.contactName,
            contactEmail: this.contactEmail,
            contactMessage: this.contactMessage,
            url: this.url,
            code: this.code,
            to: this.to,
            subject
        });
        // 2. Define Email Options
        // include plain text (not as html) important
        const mailOptions = {
            from: this.from,
            to: this.to,
            subject: subject,
            html,
            text: convert(html, {
                wordwrap: false,
              })
        }
        // 3. Create a transport and send email
        await this.newTransport().sendMail(mailOptions);
    }

    async sendCode() {
        await this.send("sendCode", "Dein Inserate-Code")
    }

    async sendContact() {
        await this.send("sendContact", "Du wurdest kontaktiert")
    }

}

