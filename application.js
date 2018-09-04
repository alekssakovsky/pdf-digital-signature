let CronJob = require('cron').CronJob;
new CronJob('0-59 * * * *', function() {
  console.log('blah-blah-blah');
}, null, true);