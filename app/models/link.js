var db = require('../config');
var Clicks = require('./click');

var Link = db.Model.extend({
  tableName: 'urls',
  clicks: function() {
    return this.hasMany(Click);
  }
});

module.exports = Link;
