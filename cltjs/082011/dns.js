var dns = require('dns');
var domain = process.argv.length > 2 ? process.argv[2] : 'www.google.com';

console.error('resolving domain: %s', domain);

// from the nodejs.org docs
dns.resolve4(domain, function (err, addresses) {
  if (err) throw err;

  console.error('found addresses: ' + JSON.stringify(addresses));

  addresses.forEach(function (a) {
    dns.reverse(a, function (err, domains) {
      if (err) {
        console.error('reverse for ' + a + ' failed: ' + err.message);
      } else {
        console.error('reverse for ' + a + ': ' + JSON.stringify(domains));
      }
    });
  });
});
