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

const p1 = 'https://www.amazon.com/s/ref=nb_sb_noss_2?url=search-alias%3Dinstant-video&field-keywords=Arnold';
const p2 = 'https://www.amazon.com/s/ref=sr_pg_2?rh=n%3A2858778011%2Ck%3AArnold&page=2&keywords=Arnold&ie=UTF8&qid=1536231007';
async function savePdf(data, counter) {
  console.log(counter);
  const instance = await phantom.create();
  const page = await instance.createPage();
  const pageOpen = await page.open(data.v_site + data.customerN);
  console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!',pageOpen);
  await page.render(counter + data.customerN + '.pdf');
  await instance.exit();
}