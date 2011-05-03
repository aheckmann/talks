
var cp =require('child_process')
  , exec = cp.exec;

// runs the date executable
exec('date', function (err, data) {
  if (err) return console.error('got error', err);
  console.error('The date is %s', data);
});
