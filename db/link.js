var db = require('./config');

var link = db.Model.extend({
  tableName: 'urls'
});

module.exports = link;
