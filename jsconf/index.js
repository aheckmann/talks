
const express = require('express')
    , mongoose = require('mongoose')
    , Promise = mongoose.Promise
    , Schema = mongoose.Schema

/**
 * Add our extensions.
 */

require('./lib/instrument');
require('express-mongoose');

/**
 * User model.
 */

var User = new Schema({
    name: String
});

User.methods.getLikes = function (callback) {
  return this.db.model('Likes')
             .find({ _user: this._id }, callback);
};

mongoose.model('User', User);

/**
 * Likes model.
 */

var Likes = new Schema({
    _user: Schema.ObjectId
  , desc : String
});

mongoose.model('Likes', Likes);

/**
 * News model.
 */

var News = new Schema({
    title  : String
  , content: String
  , created: Date
});

News.statics.getLatest = function (callback) {
  // just looks up everything
  var promise = new Promise(callback);
  this.find({}, promise.resolve.bind(promise));
  return promise;
};

mongoose.model('News', News);

/**
 * Db Connection.
 */

var db = mongoose.createConnection('mongodb://localhost/oregontrail');
db.on('open', function () {
  //console.error('mongoose connected');
  listening();
});

/**
 * Create server.
 */

var app = express.createServer();
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.logger());
app.use(express.favicon());
app.use(require('./lib/user')(db));
app.listen(8000);
app.once('listening', function () {
  app.islistening = true;
  listening();
});
app.once('close', function () {
  db.close();
});

function listening () {
  if (app.islistening && 1 === db.readyState) {
    console.error('\x1b[32mOregon Trail\x1b[0m '
                + 'is running on http://localhost:8000');
  }
}

/**
 * Include routes.
 */

require('./routes')(app, db);

