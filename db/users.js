var db = require('./config');
var User = require('./user');

var Users = db.Collection.extend({
  model: User
});

module.exports = Users;
