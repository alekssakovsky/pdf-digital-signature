const Mailer = require('nodemailer');
const SENDER_CONFIG = require('./config/email');

const transporter = Mailer.createTransport(SENDER_CONFIG.mail);

transporter.sendMail(SENDER_CONFIG.mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});