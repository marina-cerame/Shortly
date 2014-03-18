var db = require('../config');

var User = db.Model.extend({
  tableName: 'users'
});

module.exports = User;
