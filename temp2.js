var casper = require('casper').create({
  verbose: true,
  logLevel: "debug"
});

casper.options.waitTimeout = 5000;

var url = 'https://www.amazon.com/s/ref=nb_sb_noss_2?url=search-alias%3Dinstant-video&field-keywords=Arnold';

casper.on("error", function (err) {
  this.log(err, "error");
  this.exit(1);
});

casper.start(url);

casper.thenEvaluate(function() {
  if (this.exists('#pagnNextLink')) {
    this.echo('found #pagnNextLink', 'INFO');
  } else {
    this.echo('#pagnNextLink not found', 'ERROR');
  }
});
for(var i=0; i < 3; i++) {
  casper.then(function () {
    // Click on 1st result link
    this.click('#pagnNextString');
  });
}
casper.run();