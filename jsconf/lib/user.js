
module.exports = function (db) {
  return function (req, res, next) {
    // cheat and just get the first user (prepopulated in the db beforehand)
    db.model('User').findOne({}, function (err, user) {
      if (err) return next(err);
      req.user = user;
      next();
    });
  }
}
