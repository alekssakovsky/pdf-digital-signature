'use strict';
const CronJob = require('cron').CronJob;
const phantom = require('phantom');
const db = require('./Db');
const SELECT_ALL_CUSTOMERS = require('./Db').SELECT_ALL_CUSTOMERS;
let counter = 0;

// new CronJob('0-59 * * * *', () => {
//
new CronJob('* * * * * *', function () {
  counter++;
  db.dbConnect(SELECT_ALL_CUSTOMERS)
    .then((results) => {
      results.forEach((result) => savePdf(result, counter));
    });
}, null, true);


async function savePdf(data, counter) {
  console.log(counter);
  const instance = await phantom.create();
  const page = await instance.createPage();
  await page.open(data.v_site + data.customerN);
  await page.render(counter + data.customerN + '.pdf');
  await instance.exit();
}