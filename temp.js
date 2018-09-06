const CronJob = require('cron').CronJob;
const phantom = require('phantom');

new CronJob('0-59 * * * *', () => {
  renderGoogle();
}, null, true);


function renderGoogle() {
  phantom.create()
    .then((ph) => {
      ph.createPage()
        .then((page) => {
          page.open('https://www.amazon.com/s/ref=nb_sb_noss_2?url=search-alias%3Dinstant-video&field-keywords=Arnold')
            .then((status) => {
              page.render('google.pdf')
                .then(() => {
                  console.log('Page Rendered, status: ', status);
                  ph.exit();
                });
            });
        });
    });
}