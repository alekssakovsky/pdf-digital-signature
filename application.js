'use strict';
const CronJob = require('cron').CronJob;
const makePDF = require('./pdfTools').makePDF;
const db = require('./Db');

// const tempUrl = 'https://www.amazon.com/s/ref=nb_sb_noss_2?url=search-alias%3Dinstant-video&field-keywords=';

new CronJob('0-59 * * * *', () => {

db.dbConnect(db.SELECT_CUSTOMERS_BY_HISTORY)
  .then((results) => {
    let promises = [];
    results.forEach((result) => {
      promises.push(makePDF(result.v_site, result.customerN));
    });
    Promise.all(promises)
      .then((successWriteFile) => {
        console.log(successWriteFile);
        db.dbConnect(db.UPDATE_IN_HISTORY_LAST_ID_CUSTOMER, results[0].c_id)
          .then(() => console.log('history updated'))
          .catch(error => console.error(error));
      })
      .catch(error => console.error(error));
  })
  .catch(error => console.log(error));

}, null, true);


function zeroingHistory() {
  db.dbConnect(db.UPDATE_IN_HISTORY_LAST_ID_CUSTOMER, 1)
    .then(() => console.log('history updated'))
    .catch(error => console.error(error));
}
// zeroingHistory();