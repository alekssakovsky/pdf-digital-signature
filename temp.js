'use strict';
const phantom = require('phantom');
// const url = 'https://www.amazon.com/s/ref=nb_sb_noss_2?url=search-alias%3Dinstant-video&field-keywords=Arnold';
const casper_nodejs = require('casper-nodejs');
// const casper_nodejs = require('../../index.js');
const url = "http://google.com";
const casper = casper_nodejs.create(url, {});





// once the page is loaded, execute that in our current nodejs context
// casper.then(function executed_in_this_context() {
//   console.log("page loaded");
// });
//
// // then, execute that in casperjs, and the second callback in the current nodejs context
// casper.then(function executed_in_casperjs_context() {
//   return 42;
// }, function executed_in_this_context(ret) {
//   console.log("it works: " + ret);
//
// // casper.exit() can be placed here too, instead of in the bottom :)
//   // casper.exit();
// });
//
// // exit casper after executing the 2 previous 'then'
// casper.exit();
//
//








// (async function savePdf(data) {
//   console.log('START');
//   const instance = await phantom.create();
//   const page = await instance.createPage();
//
//   const pageOpen = await page.open(url);
//
//
//
//   await page.evaluate((mouseclick_fn) => {
//       window.setTimeout(
//         function () {
//           let element = $('pagnNextString')[0];
//           mouseclick_fn(element);
//         },
//         2000
//       );
//
//     },
//     mouseclick
//   );
//
//
//
//
//   console.log(page);
//
//   console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!', pageOpen);
//
//   await page.render('1.pdf');
//
//   await instance.exit();
// })();
//
// async function mouseclick(element) { //расширяем возможности phantomjs, делаем новую функцию настоящего клика по элементу
//   // create a mouse click event
//   let event = document.createEvent('MouseEvents');
//   event.initMouseEvent('click', true, true, window, 1, 0, 0);
//   // send click to element
//   element.dispatchEvent(event);
// }




// const page = require('webpage').create();
// // const page = phantom.create();
//
// console.log('The default user agent is ' + page.settings.userAgent);
// page.settings.userAgent = 'SpecialAgent';
// page.open('http://www.httpuseragent.org', function(status) {
//   if (status !== 'success') {
//     console.log('Unable to access network');
//   } else {
//     var ua = page.evaluate(function() {
//       return document.getElementById('qua').textContent;
//     });
//     console.log(ua);
//   }
//   phantom.exit();
// });


// async function scrapePage() {
// console.log('------------------2-----------------');
//   await page.render('2Arnold.pdf');
//   // if (exists('.srSprite pagnNextArrow')) {
//   //   click('.srSprite pagnNextArrow');
//   //   setTimeout(function () {
//   //     scrapePage();
//   //   }, 5000);
//   // } else {
//    await phantom.exit();
//   // }
// }
//
// async function pages() {
//   const instance = await phantom.create();
//   const page = await instance.createPage();
//   await page.open(url, function () {
//
//     console.log('------------------1-------------------');
//     scrapePage();
//   });
// }
//
// pages();