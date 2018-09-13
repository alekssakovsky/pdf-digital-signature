var casper = require('casper').create({
  verbose: true,
  logLevel: "debug"
});

// casper.options.retryTimeout = 5000;

var url = 'https://www.amazon.com/s/ref=nb_sb_noss_2?url=search-alias%3Dinstant-video&field-keywords=Arnold';


casper.echo("Casper CLI passed args:");
require("utils").dump(casper.cli.args);
casper.echo(require('utils').format(casper.cli.args));

// casper.echo("Casper CLI passed options:");
// require("utils").dump(casper.cli.options);

casper.exit();


//
//
// casper.on("error", function (err) {
//   this.log(err, "error");
//   this.exit(1);
// });
//
// casper.start(casper.cli.args);
//
// casper.page.paperSize = {
//   width: '8.3in',
//   height: '11.7in',
//   orientation: 'portrait',
//   border: '0.4in'
// };
//
// for (var i = 1; i < 4; i++) {
//   function promiseCall(count) {
//     casper.wait(5000, function () {
//       casper.then(function () {
//         this.echo('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!                 wait 5000  ' + count + '                       !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
//
//         casper.capture('arnold ' + count + '.pdf');
//         casper.echo('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!                     ' + count + '                       !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
//       });
//     });
//   }
//
//   promiseCall(i);
//   casper.then(function () {
//     // Click on 1st result link
//     this.click('#pagnNextString');
//   });
//
// }
// casper.run();