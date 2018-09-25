'use strict';

const MAILGUN_CONFIG = require('./config/mailgun.json');
const mailgun = require('mailgun-js')({
  apiKey: "2e90fe3e2f9d1aadcc773d0882c24adb-0e6e8cad-e845da62",
  domain: "open-corp.com",
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

sendMail('Я Вам пишу, чего же боле?')
  .then()
  .catch((error));