var express = require('express');
var util = require('./lib/utility')
var partials = require('express-partials');

var db = require('./db/config');
var Users = require('./db/users');
var User = require('./db/user');
var Links = require('./db/links');
var Link = require('./db/link');


/*  ------ SERVER ------ */

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

app.get(['/', '/create', '/links'], function(req, res, next) {
// app.get(['/', '/create'], function(req, res, next) {
  var userLoggedIn = util.isLoggedIn(req);
  if (!userLoggedIn) {
    res.redirect('/login');
  } else {
    next();
  }
});

app.get('/', function(req, res) {
  res.render('index');
});

app.get('/links', function(req, res) {
  Links.fetch().then(function(response) {
    var links = response.models;
    res.send(200, links);
  })
});

app.post('/links', function(req, res) {
  var uri = req.body.url;

  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url')
    return res.send(404);
  }

  new Link({ url: uri }).fetch().then(function(found) {
    if (found) {
      res.send(200, found.attributes);
    } else {
      util.getUrlTitle(uri, function(title) {
        var sha = util.createSha(uri);
        var newLink = new Link({
          url: uri,
          title: title,
          code: sha,
          base_url: req.headers.origin,
          visits: 0
        });

        newLink.save().then(function(newLink) {
          Links.add(newLink);

          app.get('/' + sha, function(req, res) {
            new Link({ code: sha }).fetch().then(function(found) {
              var updatedVisits = found.attributes.visits += 1;
              db.knex('urls')
                .where('code', '=', sha)
                .update({
                  visits: updatedVisits
                }).then(function() {
                  res.redirect(found.attributes.url);
                });
            });
          });

          res.send(200, newLink);
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
        //TODO: how do I keep this on /login without redirect?
        res.redirect('/login');
      } else {
        var foundUser = user.attributes;
        var userPassword = foundUser.password;
        util.comparePassword(password, userPassword, function(err, match) {
          if (match) {
            createSession(req, res, user);
          } else {
            //TODO: how do I keep this on /login without redirect?
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
              createSession(req, res, newUser);
              Users.add(newUser);
            });
        });
      } else {
        //TODO: how do I keep this on /signup without redirect?
        res.redirect('/signup')
      }
    })
});

app.listen(4568);


/*  ------ UTILITY ------ */

// TODO: Break the rest of these out into another file
// how do I transfer the functions that use app -- turns into a circular reference, no? should I define app in the util file?

var addShortenedUrlRedirects = function() {
  Links.fetch()
    .then(function(allLinks) {
      var entries = allLinks.models;
      entries.forEach(function(link) {
        var sha = link.code;
        app.get('/' + sha, function(req, res) {
          Links.findOne({ code: sha }).exec(function(err, entry) {
            entry.visits = entry.visits += 1;
            entry.save();
            res.redirect(entry.url)
          })
        });
      });
    });
}

var createSession = function(req, res, newUser) {
  addShortenedUrlRedirects();
  return req.session.regenerate(function() {
      req.session.user = newUser;
      res.redirect('/');
    });
};
