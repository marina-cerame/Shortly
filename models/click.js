var db = require('./config');
var Link = require('./link.js')

var Click = db.Model.extend({
  tableName: 'clicks',
  link: function() {
    return this.belongsTo(Link);
  }
});

module.exports = Click;
