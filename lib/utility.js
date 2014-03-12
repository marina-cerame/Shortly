var open = require('open-uri');
var crypto = require('crypto');
var bcrypt = require('bcrypt');

var Links = require('../models/links');

exports.getUrlTitle = function(url, cb) {
  open(url, function(err, html) {
    if (err) {
      console.log('Error reading url heading: ', err);
      return;
    } else {
      var tag = /<title>(.*)<\/title>/;
      var title = html.match(tag)[1];
      cb(title);
    }
  });
};

exports.isValidUrl = (function() {
  var rValidUrl = /^(?!mailto:)(?:(?:https?|ftp):\/\/)?(?:\S+(?::\S*)?@)?(?:(?:(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[0-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))|localhost)(?::\d{2,5})?(?:\/[^\s]*)?$/i;
  return function(url) {
    return url.match(rValidUrl);
  };
}());

exports.createSha = function(uri) {
  var shasum = crypto.createHash('sha1');
  shasum.update(uri);
  return shasum.digest('hex').slice(0, 5);
};

exports.isLoggedIn = function(req, res) {
  return req.session ? !!req.session.user : false;
};

exports.hashPassword = function(password, cb) {
  // 10 is the number of rounds to process the data for
  bcrypt.genSalt(10, function(err, salt) {
    if (err) {
      return console.error('error salting password in first stage', err);
    }
    bcrypt.hash(password, salt, function(err, hash) {
      if (err) {
        return console.error('error salting password', err);
      }
      return cb(hash);
    });
  });
};

exports.comparePassword = function(attemptedPassword, userPassword, cb) {
  bcrypt.compare(attemptedPassword, userPassword, function(err, isMatch) {
    return cb(err, isMatch);
  });
};

// TODO: pass in links as arg
var addShortenedUrlRedirects = function(app) {
  Links.fetch().then(function(links) {
    links.models.forEach(function(link) {
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

exports.createSession = function(app, req, res, newUser) {
  addShortenedUrlRedirects(app);
  return req.session.regenerate(function() {
      req.session.user = newUser;
      res.redirect('/');
    });
};
