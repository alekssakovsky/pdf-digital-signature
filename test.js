const exec = require('child_process').exec;
const cmd = `casperjs casper-script.js --vendor="https://www.amazon.com/s/ref=nb_sb_noss_2?url=search-alias%3Dinstant-video&field-keywords=" --customer="arnold"`;

exec(cmd, (error, stdout, stderr) => {
  console.log('error - ', error);
  console.log('stdout - ', stdout);
  console.log('stderr - ', stderr);
});