var db = require('../config');
var Click = require('./click');

var Link = db.Model.extend({
  tableName: 'urls',
  clicks: function() {
    return this.hasMany(Click);
  }
});

module.exports = Link;
