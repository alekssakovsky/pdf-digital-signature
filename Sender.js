'use strict';

const MAILGUN_CONFIG = require('./config/mailgun.json');
const mailgun = require('mailgun-js')({
  apiKey: MAILGUN_CONFIG.API_KEY,
  domain: MAILGUN_CONFIG.DOMAIN,
});

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
  let data = {
    from: MAILGUN_CONFIG.SMTP_login,
    to: MAILGUN_CONFIG.TO,
    subject: 'link',
    text: message
  };

  return new Promise((resolve, reject) => {
    mailgun.messages().send(data, function (error) {
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