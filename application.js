'use strict';
const CronJob = require('cron').CronJob;
const makePDF = require('./pdfTools').makePDF;
const db = require('./Db');
const CRON_CONFIG = require('./config/cron.json');
const GoogleDrive = require('./GoogleDrive').GoogleDrive;
const sendMail = require('./Sender').sendMail;
const fs = require('fs');

/**
 * It's for a given period of time makes a query to the database,
 * makes a screen of three pages, saves in one pdf file,
 * deletes the original files, adds a digital signature to the file.
 * Uploads this file to Google Drive. Adds permissions "for all",
 * sends an email to a link to the file.
 */
// new CronJob(CRON_CONFIG.EVERY_MINUTE, () => {
/*  db.dbConnect(db.SELECT_CUSTOMERS_BY_HISTORY)
    .then((results) => {
      let promises = [];
      results.forEach((result) => {
        promises.push(makePDF(result.v_site, result.customerN));
      });
      Promise.all(promises)
        .then((filesDefinition) => {
          filesDefinition.forEach((fileDefinition) => {
            const googleDrive = new GoogleDrive();
            googleDrive.getToken()
              .then(() => {
                googleDrive.insertPdfFile(fileDefinition)
                  .then((fileId) => {
                    fs.unlink(`${fileDefinition.pathFile}${fileDefinition.fileName}`, (error) => {
                      if (error) {
                        console.error(`I cant delete source file: ${fileDefinition.pathFile}${fileDefinition.fileName}`);
                      }
                    });
                    googleDrive.grantWriteSheetFilePermission(fileId)
                      .then((linkFile) => {
                        console.log(linkFile);
                        sendMail(linkFile)
                          .then(() => console.log('success'))
                          .catch(error => console.error(error));
                      });
                  });
              });
          });
          db.dbConnect(db.UPDATE_IN_HISTORY_LAST_ID_CUSTOMER, results[0].c_id)
            .then(() => console.log('history updated'))
            .catch(error => console.error(error));
        })
        .catch(error => console.error(error));
    })
    .catch(error => console.log(error));

// }, null, true);

/**
 * Zeroes counter in the database.
 */
function zeroingHistory() {
  db.dbConnect(db.UPDATE_IN_HISTORY_LAST_ID_CUSTOMER, 1)
    .then(() => console.log('history updated'))
    .catch(error => console.error(error));
}
zeroingHistory();