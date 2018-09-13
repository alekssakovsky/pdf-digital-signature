'use strict';
const CronJob = require('cron').CronJob;
const db = require('./Db');
const SELECT_ALL_CUSTOMERS = require('./Db').SELECT_ALL_CUSTOMERS;
const exec = require('child_process').exec;
const url = 'https://www.amazon.com/s/ref=nb_sb_noss_2?url=search-alias%3Dinstant-video&field-keywords=Arnold';

// new CronJob('0-59 * * * *', () => {

// new CronJob('* * * * * *', function () {
//   db.dbConnect(SELECT_ALL_CUSTOMERS)
//     .then((results) => {
//       results.forEach((result) => savePDFs(result));
//     });
// }, null, true);

function savePDFs(url) {

  const cmd = `casperjs casper-script.js "${url}"`;
  exec(cmd, function (error, stdout, stderr) {
    if (error) {
      return console.error(`error: ${error},\nSCRIPT WILL BE STOPPED`);
    } else {
      console.log('RUNNING: ', stdout);
    }
  });
}

savePDFs(url);

// async function savePdf(data, counter) {
// console.log(counter);
// const instance = await phantom.create();
// const page = await instance.createPage();
// const pageOpen = await page.open(data.v_site + data.customerN);
// console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!',pageOpen);
// await page.render(counter + data.customerN + '.pdf');
// await instance.exit();

// }