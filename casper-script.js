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

for (var index = 1; index < 4; index++) {
  function promiseCall(count) {
    casper.then(function () {
      casper.capture(customer + ' ' + count + '.pdf');
    });
  }

  promiseCall(index);
  casper.then(function () {
    casper.evaluate(function() {
      // document.querySelector('#pagnNextString', '100%', '100%').click();
      document.querySelector('#pagnNextString', '0', '0').click();
    });
    // this.click("#pnnext a");
    // document.querySelector('#pnnext').click();
    // this.click('#pagnNextString');
  });
}
casper.run();