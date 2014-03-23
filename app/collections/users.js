var db = require('../config');
/* START SOLUTION */
var User = require('../models/user');

var Users = new db.Collection();

Users.model = User;

module.exports = Users;
/* END SOLUTION */