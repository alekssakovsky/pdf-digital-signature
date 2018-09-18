'use strict';
const CronJob = require('cron').CronJob;
const makePDF = require('./pdfTools').makePDF;
const SELECT_ALL_CUSTOMERS = require('./Db').SELECT_ALL_CUSTOMERS;
const db = require('./Db');


// const tempUrl = 'https://www.amazon.com/s/ref=nb_sb_noss_2?url=search-alias%3Dinstant-video&field-keywords=';

new CronJob('0-59 * * * *', () => {
  db.dbConnect(SELECT_ALL_CUSTOMERS)
    .then((results) => {
      results.forEach((result) => {
        makePDF(result.v_site, result.customerN)
          .then(signedFile => console.log('THEN', signedFile))
          .catch(error => console.log('CATCH', error));
      });
    });
}, null, true);


