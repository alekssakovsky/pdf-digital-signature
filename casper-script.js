var casper = require('casper').create({
  verbose: true,
  logLevel: 'warning'
});

casper.options.retryTimeout = 5000;

//
// var customer = require('util').format(casper.cli.args[1]);
// var url = require('util').format(casper.cli.args[0]) + customer;

var customer = casper.cli.get('customer');
// var vendor = casper.cli.get('vendor');
var vendor = 'https://www.amazon.com/s/ref=nb_sb_noss_2?url=search-alias%3Dinstant-video&field-keywords=';
var url = vendor + customer;

casper.on('error', function (err) {
  this.log(err, 'error');
  this.exit(1);
});
casper.start(url);

casper.page.paperSize = {
  width: '8.3in',
  height: '11.7in',
  orientation: 'portrait',
  border: '0.4in'
};

for (var index = 1; index < 4; index++) {
  function promiseCall(count) {
    casper.then(function () {
      console.log('Creating pdf: ./temp/' + customer + ' ' + count + '.pdf');
      casper.capture('./temp/' + customer + ' ' + count + '.pdf');
    });
  }

  promiseCall(index);
  casper.then(function () {
    casper.evaluate(function() {
      document.querySelector('#pagnNextString', '0', '0').click();
    });
  });
}
casper.run();