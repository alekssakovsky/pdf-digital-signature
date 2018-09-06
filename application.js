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


function savePdf(data, counter) {
  console.log(counter);
  phantom.create()
    .then((ph) => {
      // console.log('===========================1111');
      ph.createPage()
        .then((page) => {
          // console.log('===========================2222');

          page.open('https://www.amazon.com/s/ref=nb_sb_noss_2?url=search-alias%3Dinstant-video&field-keywords=Arnold')

            .then((response) => {
              // console.log('===========================3333');

              console.log(response);
              page.render(counter + data.customerN + '.pdf')
                .then(() => {
                  // console.log('===========================4444');

                  ph.exit();
                });
            });
        });
    });
}


// async function savePdf(data, counter) {
//   console.log(counter);
//   // console.log(data.v_site + data.customerN);
//   const instance = await phantom.create();
//   const page = await instance.createPage();
//
//   // await page.open(data.v_site + data.customerN);
//   await page.open('https://www.amazon.com/s/ref=nb_sb_noss_2?url=search-alias%3Dinstant-video&field-keywords=Arnold');
//   console.log(page);
//   // await page.open('http://htmlbook.ru');
//   // await page.render(counter + 'htmlbook.pdf');
//   await page.render(counter + data.customerN + '.pdf');
//   await instance.exit();
// }