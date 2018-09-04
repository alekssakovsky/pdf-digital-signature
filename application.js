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
          page.open("http://www.google.com")
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