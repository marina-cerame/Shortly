var request = require('request');
var crypto = require('crypto');
var bcrypt = require('bcrypt');

var db = require('../app/config');
var Links = require('../app/collections/links');
var Link = require('../app/models/link');
var Click = require('../app/models/click');

exports.getUrlTitle = function(url, cb) {
  request(url, function(err, res, html) {
    if (err) {
      console.log('Error reading url heading: ', err);
      return cb(err);
    } else {
      var tag = /<title>(.*)<\/title>/;
      var match = html.match(tag);
      var title = match ? match[1] : url;
      return cb(err, title);
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

var addShortenedUrlRedirect = function(app, link) {
  var sha = link.attributes.code;
  app.get('/' + sha, function(req, res) {
    var click = new Click({
      url: link.attributes.url,
      createdAt: new Date(),
      link_id: link.attributes.code
    });

    click.save().then(function () {
      new Link({ code: sha }).fetch().then(function(found) {
        db.knex('urls')
          .where('code', '=', sha)
          .update({
            visits: found.attributes.visits += 1,
          }).then(function() {
            return res.redirect(found.attributes.url);
          });
        });
    });
  });
};

exports.addShortenedUrlRedirect = addShortenedUrlRedirect;

exports.createSession = function(app, req, res, newUser) {
  Links.fetch().then(function(links) {
    links.models.forEach(function(link) {
      addShortenedUrlRedirect(app, link);
    });
  });
  global.userLoggedIn = true;
  return req.session.regenerate(function() {
      req.session.user = newUser;
      res.redirect('/');
    });
};
