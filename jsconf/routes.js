
module.exports = function (app, db) {
  const News = db.model('News');

  app.get('/', function (req, res) {
    res.partial('layout', { body: '' });
  });


  // standard

  app.get('/dysentery', function (req, res, next) {
    var likes
      , news;

    News.getLatest(function (err, stories) {
      if (err) return error(err);
      news = stories;
      likes && news && render();
    });

    req.user.getLikes(function (err, liked) {
      if (err) return error(err);
      likes = liked;
      likes && news && render();
    });

    function error (err) {
      if (error.err) return;
      next(error.err = err);
    }

    function render () {
      res.render('trail', {
          news: news
        , likes: likes
        , heading: "Standard Version"
      });
    }

  });

  // with express-mongoose

  app.get('/bacon', function (req, res) {
    res.render('trail', {
        news: News.getLatest()
      , likes: req.user.getLikes()
      , heading: "Using Express-Mongoose"
    });
  });

  // instrumentation

  app.get('/died/from/:disease', function (req, res, next) {
    // debug: Oh noes! I died from %s, req.params.disease
    // start: 'getLatest'

    News.getLatest(function (err, stories) {

      // end: 'getLatest'

      res.render('trail', {
          news: stories
        , likes: req.user.getLikes()
        , heading: "Using Instrumentation"
      });
    });

  });

}
