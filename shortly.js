var express = require('express');
var util = require('./lib/utility');
var partials = require('express-partials');

var db = require('./app/config');
var Users = require('./app/collections/users');
var User = require('./app/models/user');
var Links = require('./app/collections/links');
var Link = require('./app/models/link');
var Click = require('./app/models/click');


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
    console.log('Not a valid url: ', uri);
    return res.send(404);
  }

  new Link({ url: uri }).fetch().then(function(found) {
    if (found) {
      res.send(200, found.attributes);
    } else {
      util.getUrlTitle(uri, function(err, title) {
        if (err) {
          console.log('Error reading URL heading: ', err);
          return res.send(404);
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
          createdAt: new Date(),
          link_id: link.attributes.code
        });

        click.save().then(function () {

          link.save().then(function(newLink) {
            Links.add(newLink);
            util.addShortenedUrlRedirect(app, link);
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
        res.redirect('/login');
      } else {
        var foundUser = user.attributes;
        var userPassword = foundUser.password;
        util.comparePassword(password, userPassword, function(err, match) {
          if (match) {
            util.createSession(app, req, res, user);
          } else {
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
        console.log('Account already exists');
        res.redirect('/signup')
      }
    })
});

app.listen(4568);
