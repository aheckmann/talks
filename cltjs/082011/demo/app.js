
/**
 * Module dependencies.
 */

var express = require('express'); // npm install express
var request = require('request'); // npm install request
var meetup = require('../meetup').url;

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.bodyParser());
  app.use(express.logger());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/', function(req, res){
  res.render('index', {
    title: 'Express'
  });
});

app.get('/jade', function (req, res, next) {
  if ('jade' === req.app.set('view engine')) {
    res.send("we are using jade");
  } else {
    next(new Error('doh, we are not using jade?!?!'));
  }
});

app.get('/cltjs', function (req, res) {
  res.render('cltjs', { title: 'yo yo' });
});

app.get('/cltjs/member/:id?', function (req, res, next) {
  if (!members) {
    return res.send('meetup members are not yet available. try back shortly');
  }

  var id = req.param('id').toLowerCase().trim();
  id = '@' + id;

  // find the cltjs meetup.com member with a matching twitter handle
  var member = members.filter(function (mem) {
    return mem.other_services &&
           mem.other_services.twitter &&
           mem.other_services.twitter.identifier &&
           id === mem.other_services.twitter.identifier.toLowerCase().trim();
  })[0];

  res.render('cltjs', {
      title: 'Member info'
    , member: member
  });
});

app.get('/cltjs/members', function (req, res) {
  if (members)
    res.send(members); // passing json directly to the client
  else return req.next();
});

app.get('/stream', function (req, res) {
  var stream = require('fs')
  .createReadStream('/home/aaron/Desktop/bigEarth.png');

  // streaming files from the file system straight to the client
  stream.pipe(res);
});

/**
 * Get all cltjs memebers from meetup.com api
 */

var members;
;(function getmembers () {
  console.error('requesting meetup members');

  request.get(meetup, function (err, resp, body) {
    if (err) return error(err);
    if (200 !== resp.statusCode) return error(body);

    try {
      members = JSON.parse(body).results;
    } catch (err) {
      return error(err);
    }

    console.error('received all members!')
  });

  function error (err) {
    console.error('could not reach meetup.com', err);
  }
})();

// Only listen on $ node app.js

if (!module.parent) {
  app.listen(3000);
  console.log("Express server listening on port %d", app.address().port);
}
