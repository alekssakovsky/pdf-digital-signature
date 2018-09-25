'use strict';
const CronJob = require('cron').CronJob;
const makePDF = require('./pdfTools').makePDF;
const db = require('./Db');
const CRON_CONFIG = require('./config/cron.json');
const uploadFile = require('./S3-service').uploadFile;
const sendMail = require('./Sender').sendMail;
const fs = require('fs');

/**
 * It's for a given period of time makes a query to the database,
 * makes a screen of three pages, saves in one pdf file,
 * deletes the original files, adds a digital signature to the file.
 * Uploads this file to Google Drive. Adds permissions "for all",
 * sends an email to a link to the file.
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
