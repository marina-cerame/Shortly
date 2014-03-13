var express = require('express');
var util = require('./lib/utility');
var partials = require('express-partials');

var db = require('./models/config');
var Users = require('./models/users');
var User = require('./models/user');
var Links = require('./models/links');
var Link = require('./models/link');
var Click = require('./models/click');


var app = express();

app.configure(function() {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(partials());
  app.use(express.bodyParser())
  app.use(express.static(__dirname + '/public'));
  app.use(express.cookieParser('shhhh, very secret'));
  app.use(express.session());
});

app.get('/', function(req, res, next) {
  if (!util.isLoggedIn(req)) {
    res.redirect('/login');
  } else {
    next();
  }
});

app.get('/links', function(req, res, next) {
  if (!util.isLoggedIn(req)) {
    res.redirect('/login');
  } else {
    next();
  }
});

app.get('/create', function(req, res, next) {
  if (!util.isLoggedIn(req)) {
    res.redirect('/login');
  } else {
    next();
  }
});

app.get('/', function(req, res) {
  res.render('index');
});

app.get('/create', function(req, res) {
  res.render('index');
});

app.get('/links', function(req, res) {
  Links.fetch().then(function(links) {
    res.send(200, links.models);
  })
});

app.post('/links', function(req, res) {
  var uri = req.body.url;

  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url');
    return res.send(500);
  }

  new Link({ url: uri }).fetch().then(function(found) {
    if (found) {
      res.send(200, found.attributes);
    } else {
      util.getUrlTitle(uri, function(err, title) {
        if (err) {
          console.log('Error reading URL heading: ', err);
          return res.send(500);
        }
        var sha = util.createSha(uri);
        var link = new Link({
          url: uri,
          title: title,
          code: sha,
          base_url: req.headers.origin,
          visits: 0
        });

        var click = new Click({
          url: uri,
          updatedAt: new Date()
        });
        click.link = link;
        click.save().then(function () {

          link.save().then(function(newLink) {
            Links.add(newLink);

            app.get('/' + sha, function(req, res) {
              new Link({ code: sha }).fetch().then(function(found) {

                var click = new Click({
                  url: uri,
                  updatedAt: new Date()
                });
                click.link = link;

                click.save().then(function () {
                  db.knex('clicks')
                    .select()
                    .then(function(res) {
                      console.log('res', res);
                    });
                  db.knex('urls')
                    .where('code', '=', sha)
                    .update({
                      visits: found.attributes.visits += 1,
                    }).then(function() {
                      res.redirect(found.attributes.url);
                    });
                });
              });
            });

            res.send(200, newLink);
          });
        });
      });
    }
  });
});

app.get('/login', function(req, res) {
  res.render('login');
});

app.post('/login', function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  new User({ username: username })
    .fetch()
    .then(function(user) {
      if (!user) {
        // TODO: display a message to the user saying that credentials are bad
        res.redirect('/login');
      } else {
        var foundUser = user.attributes;
        var userPassword = foundUser.password;
        util.comparePassword(password, userPassword, function(err, match) {
          if (match) {
            util.createSession(app, req, res, user);
          } else {
            // TODO: display a message to the user saying that credentials are bad
            res.redirect('/login');
          }
        })
      }
  });
});

app.get('/logout', function(req, res) {
  req.session.destroy(function(){
    res.redirect('/login');
  });
});

app.get('/signup', function(req, res) {
  res.render('signup');
});

app.post('/signup', function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  new User({ username: username })
    .fetch()
    .then(function(user) {
      if (!user) {
        util.hashPassword(password, function(hashedPassword) {
          var newUser = new User({
            username: username,
            password: hashedPassword
          });
          newUser.save()
            .then(function(newUser) {
              util.createSession(app, req, res, newUser);
              Users.add(newUser);
            });
        });
      } else {
        // TODO: display a message to the user saying that credentials are bad
        console.log('Account already exists');
        res.redirect('/signup')
      }
    })
});

app.listen(4568);
