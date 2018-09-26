'use strict';
const CronJob = require('cron').CronJob;
const makePDF = require('./pdfTools').makePDF;
const db = require('./Db');
const CRON_CONFIG = require('./config/cron.json');
const uploadFile = require('./S3-service').uploadFile;
const sendMail = require('./Sender').sendMail;
const fs = require('fs');

/**
 * Scrips for a given period of time makes a query to the database,
 * 3 times follows the links and makes a screen of three pages and saves it in one pdf file.
 * After that deletes the source files, adds a digital signature in the new file.
 * Uploads this file to AWS S3 service with "read all" permission and
 * sends an email with a link to the file.
 * After that in database (table history) makes entry with last id of customer.
 */
new CronJob(CRON_CONFIG.EVERY_MINUTE, () => {
  let idCustomer;
  db.dbConnect(db.SELECT_CUSTOMERS_BY_HISTORY)
    .then((results) => {
      idCustomer = results[0].c_id;
      let promises = [];
      results.forEach((result) => {
        promises.push(makePDF(result.v_site, result.customerN));
      });
      return Promise.all(promises);
    })

    .then((filesDefinition) => {
      let promises = [];
      filesDefinition.forEach((fileDefinition) => {
        promises.push(uploadFile(fileDefinition));
        fs.unlink(`${fileDefinition.pathFile}${fileDefinition.fileName}`, (error) => {
          if (error) {
            console.error(`I cant delete source file: ${fileDefinition.pathFile}${fileDefinition.fileName}`);
          }
        });
      });
      return Promise.all(promises);
    })

    .then((links) => {
      let promises = [];
      links.forEach((link) => {
        console.log(link);
        promises.push(sendMail(link))
      });
      return Promise.all(promises);
    })

    .then(() => {
      return db.dbConnect(db.UPDATE_IN_HISTORY_LAST_ID_CUSTOMER, idCustomer)
    })

    .then(() => console.log('history updated'))
    .catch(error => console.error(error));
}, null, true);


/**
 * Zeroes counter in the database.
 */
function zeroingHistory() {
  db.dbConnect(db.UPDATE_IN_HISTORY_LAST_ID_CUSTOMER, 0)
    .then(() => console.log('history updated'))
    .catch(error => console.error(error));
}
