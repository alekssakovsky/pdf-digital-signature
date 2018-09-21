'use strict';
const mailer = require('nodemailer');
const SENDER_CONFIG = require('./config/email');

/**
 * Sends email.
 *
 * @param {string} message
 *
 * @returns {Promise}
 * a promise that returns resolved if letter was send
 * a promise that returns error if rejected
 * @resolve
 * @reject {string} errorStr
 */
function sendMail(message) {
  SENDER_CONFIG.mailOptions.text = message;
  const transporter = mailer.createTransport(SENDER_CONFIG.mail);

  return new Promise((resolve, reject) => {
    transporter.sendMail(SENDER_CONFIG.mailOptions, (error) => {
      if (error) {
        const errorStr = `I can\'t send email: ${error}`;
        reject(errorStr);
      } else {
        resolve();
        console.log(`Email was sent`);
      }
    });
  });
}

module.exports.sendMail = sendMail;