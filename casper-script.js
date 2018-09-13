var casper = require('casper').create({
  verbose: true,
  logLevel: 'info'
});

casper.options.retryTimeout = 5000;


var customer = require('utils').format(casper.cli.args[1]);
var url = require('utils').format(casper.cli.args[0]) + customer;

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

for (var i = 1; i < 4; i++) {
  function promiseCall(count) {
    casper.then(function () {
      casper.capture(customer + ' ' + count + '.pdf');
    });
  }

  promiseCall(i);
  casper.then(function () {
    this.click('#pagnNextString');
  });
}
casper.run();