let colors = require('colors');


casper.test.begin('\n*Colors module*\n', function suite(test) {
  casper.start()
    .thenOpen('https://www.google.fr/', function() {
      console.log("test require\n".zebra);
      console.log("test require\n".rainbow);
      console.log("test require\n".red.underline.bold);
    })
    .run(function() {
      test.done();
    });
});