'use strict';
const CronJob = require('cron').CronJob;
const db = require('./Db');
const SELECT_ALL_CUSTOMERS = require('./Db').SELECT_ALL_CUSTOMERS;
const exec = require('child_process').exec;
const merge = require('easy-pdf-merge');
const fs = require('fs');
const async = require('async');

// const fs = require('fs');
// https://www.amazon.com/s/ref=nb_sb_noss_2?url=search-alias%3Dinstant-video&field-keywords=

// new CronJob('0-59 * * * *', () => {

//   db.dbConnect(SELECT_ALL_CUSTOMERS)
//     .then((results) => {
//       results.forEach((result) => {
//         savePDFs(result.v_site, result.customerN);
//       });
//     });
// // }, null, true);

// function savePDFs(url, customer) {
//   const cmd = `casperjs casper-script.js "${url}" "${customer}"`;
//   exec(cmd, function (error, stdout, stderr) {
//     console.log('RUNNING:\n', stdout); //TODO for development
//     if(stdout) {
let files = [];
for (let index = 1; index < 4; index++) {
  files.push(`Arnold ${index}.pdf`);
}
merge(files, `Arnold.pdf`, (err) => {
  if (err) {
    return console.log(err);
  } else {
    async.each(files, fs.unlink);
  }
});
//
//   });
// }