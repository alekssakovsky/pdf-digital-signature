'use strict';
const CronJob = require('cron').CronJob;
const db = require('./Db');
const SELECT_ALL_CUSTOMERS = require('./Db').SELECT_ALL_CUSTOMERS;
const exec = require('child_process').exec;
// const url = 'https://www.amazon.com/s/ref=nb_sb_noss_2?url=search-alias%3Dinstant-video&field-keywords=';
// const customer = 'Arnold';

new CronJob('0-59 * * * *', () => {
// new CronJob('* * * * * *', function () {

  db.dbConnect(SELECT_ALL_CUSTOMERS)
    .then((results) => {
      results.forEach((result) => {
        savePDFs(result.v_site, result.customerN);
      });

    });
}, null, true);

function savePDFs(url, customer) {
  const cmd = `casperjs casper-script.js "${url}" "${customer}"`;
  exec(cmd, function (error, stdout, stderr) {
    console.log('RUNNING:\n', stdout);
  });
}