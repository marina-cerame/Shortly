var expect = require('chai').expect;
var request = require('request');

var db = require('../app/config');
var Users = require('../app/collections/users');
var User = require('../app/models/user');
var Links = require('../app/collections/links');
var Link = require('../app/models/link');

/************************************************************/
// Swap the commenting on the following lines in order to
// enable tests for authentication
/************************************************************/
/* START SOLUTION */
var xBeforeEach = beforeEach;
/* ELSE
//var xBeforeEach = beforeEach;
var xBeforeEach = function(){};
END SOLUTION */
/************************************************************/


describe('', function() {

  beforeEach(function() {
    // log out currently signed in user
    request('http://127.0.0.1:4568/logout', function(error, res, body) {
      // console.log('logging out');
    });

    // delete link for roflzoo from db so it can be created later for the test
    db.knex('urls')
      .where('url', '=', 'http://www.roflzoo.com/')
      .del()
      .catch(function(error) {
        throw {
          type: 'DatabaseError',
          message: 'Failed to create test setup data'
        };
      });

    // delete user Svnh from db so it can be created later for the test
    db.knex('users')
      .where('username', '=', 'Svnh')
      .del()
      .catch(function(error) {
        throw {
          type: 'DatabaseError',
          message: 'Failed to create test setup data'
        };
      });

    // delete user Phillip from db so it can be created later for the test
    db.knex('users')
      .where('username', '=', 'Phillip')
      .del()
      .catch(function(error) {
        throw {
          type: 'DatabaseError',
          message: 'Failed to create test setup data'
        };
      });
  });

  describe('Link creation:', function(){

    var requestWithSession = request.defaults({jar: true});

    xBeforeEach(function(done){
      new User({
          'username': 'Phillip',
          'password': 'Phillip'
      }).save().then(function(){
        var options = {
          'method': 'POST',
          'followAllRedirects': true,
          'uri': 'http://127.0.0.1:4568/login',
          'json': {
            'username': 'Phillip',
            'password': 'Phillip'
          }
        };
        // login and save session info
        requestWithSession(options, function(error, res, body) {
          done();
        });
      });
    });

    it('Shortens links', function(done) {

      var options = {
        'method': 'POST',
        'followAllRedirects': true,
        'uri': 'http://127.0.0.1:4568/links',
        'json': {
          'url': 'http://www.roflzoo.com/'
        }
      };

      requestWithSession(options, function(error, res, body) {
        expect(res.body.url).to.equal('http://www.roflzoo.com/');
        done();
      });
    });

    it('Only shortens valid urls, returning a 404 - Not found for invalid urls', function(done) {
      var options = {
        'method': 'POST',
        'uri': 'http://127.0.0.1:4568/links',
        'json': {
          'url': 'definitely not a valid url'
        }
      };

      requestWithSession(options, function(error, res, body) {
        expect(body).to.equal('Not Found');
        done();
      });
    });


    describe('With previously saved urls:', function(){

      var link;

      beforeEach(function(done){
        link = new Link({
          url: 'http://www.roflzoo.com/',
          title: 'Rofl Zoo - Daily funny animal pictures',
          base_url: 'http://127.0.0.1:4568'
        });
        link.save().then(function(){
          done();
        });
      });

      it('New links create a database entry', function(done) {
        var foundUrl;
        db.knex('urls')
          .where('url', '=', 'http://www.roflzoo.com/')
          .then(function(urls) {
            if (urls['0'] && urls['0']['url']) {
              foundUrl = urls['0']['url'];
            }
            // TODO: why is there a timeout on fail?
            expect(foundUrl).to.equal('http://www.roflzoo.com/');
            done();
          });
      });

      it('Fetches the link url title', function (done) {
        var foundTitle;
        db.knex('urls')
          .where('title', '=', 'Rofl Zoo - Daily funny animal pictures')
          .then(function(urls) {
            if (urls['0'] && urls['0']['title']) {
              foundTitle = urls['0']['title'];
            }
            // TODO: why is there a timeout on fail?
            expect(foundTitle).to.equal('Rofl Zoo - Daily funny animal pictures');
            done();
          });
      });

      it('Returns the same shortened code', function(done) {
        var options = {
          'method': 'POST',
          'followAllRedirects': true,
          'uri': 'http://127.0.0.1:4568/links',
          'json': {
            'url': 'http://www.roflzoo.com/'
          }
        };

        requestWithSession(options, function(error, res, body) {
          var secondCode = res.body.code;
          expect(secondCode).to.equal(link.get('code'));
          done();
        });
      });

      describe('Link fetching:', function(){

        it('Shortcode redirects to correct url', function(done) {
          var options = {
            'method': 'GET',
            'uri': 'http://127.0.0.1:4568/' + link.get('code'),
            'timeout': 5000
          };

          requestWithSession(options, function(error, res, body) {
            var currentLocation = res.request.href;
            expect(currentLocation).to.equal('http://www.roflzoo.com/');
            done();
          });
        });


        it('Returns all of the links to display on the links page', function(done) {
          requestWithSession('http://127.0.0.1:4568/links', function(error, res, body) {
            expect(body).to.include('"title": "Rofl Zoo - Daily funny animal pictures"');
            done();
          });
        });
      });

    });
  });

  /* START SOLUTION */
  describe /* ELSE
  xdescribe END SOLUTION */('Priviledged Access:', function(){

    it('Redirects to login page if a user tries to access the main page and is not signed in', function(done) {
      request('http://127.0.0.1:4568/', function(error, res, body) {
        expect(res.req.path).to.equal('/login');
        done();
      });
    });

    it('Redirects to login page if a user tries to create a link and is not signed in', function(done) {
      request('http://127.0.0.1:4568/create', function(error, res, body) {
        expect(res.req.path).to.equal('/login');
        done();
      });
    });

    it('Redirects to login page if a user tries to see all of the links and is not signed in', function(done) {
      request('http://127.0.0.1:4568/links', function(error, res, body) {
        expect(res.req.path).to.equal('/login');
        done();
      });
    });

  });

  /* START SOLUTION */
  describe /* ELSE
  xdescribe END SOLUTION */('Account Creation:', function(){

    it('Signup creates a user record', function(done) {
      var options = {
        'method': 'POST',
        'uri': 'http://127.0.0.1:4568/signup',
        'json': {
          'username': 'Svnh',
          'password': 'Svnh'
        }
      };

      request(options, function(error, res, body) {
        db.knex('users')
          .where('username', '=', 'Svnh')
          .then(function(res) {
            if (res[0] && res[0]['username']) {
              var user = res[0]['username'];
            }
            expect(user).to.equal('Svnh');
            done();
          }).catch(function(err) {
            throw {
              type: 'DatabaseError',
              message: 'Failed to create test setup data'
            };
          });
      });
    });

    it('Signup logs in a new user', function(done) {
      var options = {
        'method': 'POST',
        'uri': 'http://127.0.0.1:4568/signup',
        'json': {
          'username': 'Phillip',
          'password': 'Phillip'
        }
      };

      request(options, function(error, res, body) {
        expect(res.headers.location).to.equal('/');
        done();
      });
    });

  });

  /* START SOLUTION */
  describe /* ELSE
  xdescribe END SOLUTION */('Account Login:', function(){

    var requestWithSession = request.defaults({jar: true});

    beforeEach(function(done){
      new User({
          'username': 'Phillip',
          'password': 'Phillip'
      }).save().then(function(){
        done()
      });
    })

    it('Logs in existing users', function(done) {
      var options = {
        'method': 'POST',
        'uri': 'http://127.0.0.1:4568/login',
        'json': {
          'username': 'Phillip',
          'password': 'Phillip'
        }
      };

      requestWithSession(options, function(error, res, body) {
        expect(res.headers.location).to.equal('/');
        done();
      });
    });

    it('Users that do not exist are kept on login page', function(done) {
      var options = {
        'method': 'POST',
        'uri': 'http://127.0.0.1:4568/login',
        'json': {
          'username': 'Fred',
          'password': 'Fred'
        }
      };

      requestWithSession(options, function(error, res, body) {
        expect(res.headers.location).to.equal('/login');
        done();
      });
    });

  });

});
