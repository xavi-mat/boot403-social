const nodemailer = require("nodemailer");
const { auth } = require("./config.json")["development"];

let transporter = nodemailer.createTransport({
  host: "smtp-mail.outlook.com",
  secureConnection: false,
  port: 587,
  tls: {
    ciphers: 'SSLv3'
  },
  auth,
});

module.exports = transporter;
