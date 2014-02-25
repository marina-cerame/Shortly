var express = require('express');
var open = require('open-uri');
var crypto = require('crypto');
var bcrypt = require('bcrypt');

var db = require('./db/config');
var Users = require('./db/users');
var User = require('./db/user');
var Links = require('./db/links');
var Link = require('./db/link');


/*  ------ SERVER ------ */

var app = express();

app.use(express.bodyParser())
app.use(express.static(__dirname + '/public'));
app.use(express.cookieParser('shhhh, very secret'));
app.use(express.session());

app.get(['/', '/create', '/links'], function (req, res, next) {
  var userLoggedIn = loggedIn(req);
  if(!userLoggedIn) {
    // TODO: Does not work with Backbone route changes 
    res.redirect('/login');
  } else {
    next();
  }
});

app.get('/links', function (req, res) {
  Links.fetch().then(function(response) {
    var links = response.models;
    res.send(200, links);
  })
});

app.post('/links', function (req, res) {
  var uri = req.body.url;
  
  if (!verifyUrl(uri)) {
    console.log('Not a valid url')
    return res.send(500);
  }

  new Link({url: uri}).fetch().then(function (found) {
    if(found) {
      res.send(200, found.attributes);
    } else {
      getUrlTitle(uri, function (title) {
        var sha = createSha(uri);
        var newLink = new Link({ 
          url: uri,
          title: title,
          code: sha,
          base_url: req.headers.origin,
          visits: 0
        });

        newLink.save().then(function (newEntry) {
          Links.add(newLink);

          app.get('/' + sha, function (req, res) {
            new Link({code: sha}).fetch().then(function (found) {
              var updatedVisits = found.attributes.visits +=1;

              db.knex('urls')
              .where('code', '=', sha)
              .update({
                visits: updatedVisits
              }).then(function () {
                res.redirect(found.attributes.url);
              });
            });
          });
          res.send(200, newEntry);

        });
      });
    }
  });

});

app.get('/login', function (req, res) {
  res.sendfile(__dirname + '/public/login.html');
});

app.post('/login', function (req, res) {
  var username = req.body.username;
  var password = req.body.password;
  new User({ username: username })
    .fetch()
    .then(function (user) {
      if(!user) {
        res.redirect('/signup');
      } else {
        var foundUser = user.attributes;
        var userPassword = foundUser.password;
        comparePassword(password, userPassword, function(err, match) {
          if(match) {
            createSession(req, res, user);
          } else { 
            res.redirect('/signup');
          }
        }) 
      }
  });
});

app.get('/logout', function (req, res) {
  req.session.destroy(function(){
    res.redirect('/login');
  });
})

app.get('/signup', function (req, res) {
  res.sendfile(__dirname + '/public/signup.html');
});

app.post('/signup', function (req, res) {
  var username = req.body.username;
  var password = req.body.password;

   new User({ username: username })
    .fetch()
    .then(function (user) {
      if(!user) {
        hashPassword(password, function (hashedPassword) {
          var newUser = new User({
            username: username,
            password: hashedPassword
          });
          newUser.save()
            .then(function (newEntry) {
              createSession(req, res, newEntry);
              Users.add(newEntry);
            });
        });
      } else {
        res.redirect('/login')
      }
    })
});

app.listen(4568);


/*  ------ UTILITY ------ */

var getUrlTitle = function (url, cb) {
  open(url, function(err, html) {
    if(err) {
      console.log('Error reading url heading: ', err);
      return;
    } else {
      var tag = /<title>(.*)<\/title>/;
      var title = html.match(tag)[1];
      cb(title);
    }
  })
};

var verifyUrl = function (urlToMatch) {
  var urlRegEx = /^(?!mailto:)(?:(?:https?|ftp):\/\/)?(?:\S+(?::\S*)?@)?(?:(?:(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[0-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))|localhost)(?::\d{2,5})?(?:\/[^\s]*)?$/i;
  return urlToMatch.match(urlRegEx);
};

var createSha = function (uri) {
  var shasum = crypto.createHash('sha1');
  shasum.update(uri)
  return shasum.digest('hex').slice(0,5);
};

var loggedIn = function (req, res) {
  return !!req.session.user;
};

var addShortliedSiteRedirects = function () {
  Links.fetch()
  .then(function (allLinks) {
    var entries = allLinks.models;
    entries.forEach(function (link) {
      var sha = link.code
      app.get('/' + sha, function (req, res) {
        Links.findOne({ code: sha }).exec(function (err, entry) {
          entry.visits = entry.visits += 1;
          entry.save();
          res.redirect(entry.url)
        })
      });
    });
  });
}

var createSession = function (req, res, newEntry) {
  addShortliedSiteRedirects();
  return req.session.regenerate(function(){
           req.session.user = newEntry;
           res.redirect('/')
         });
};

var hashPassword = function (password, cb) {
    bcrypt.genSalt(10, function(err, salt) {
      if (err) return console.log('error salting password in first stage', err, salt);
      bcrypt.hash(password, salt, function(err, hash) {
        if (err) return console.log('error salting password', password, err, salt);
        return cb(hash);
      });
    });
}

var comparePassword = function (candidatePassword, userPassword, cb) {
  bcrypt.compare(candidatePassword, userPassword, function(err, isMatch) {
    if (err) return cb(err);
    return cb(null, isMatch);
  });
}
