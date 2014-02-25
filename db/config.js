var Bookshelf = require('bookshelf');

var db = Bookshelf.initialize({
  client: 'sqlite3',
  connection: {
    host     : '127.0.0.1',
    user     : 'your_database_user',
    password : 'password',
    database : 'shortlydbt',
    charset  : 'utf8',
    filename: './mydb.sqlite'
  }
});

db.knex.schema.hasTable('urls').then(function(exists) {
  if(!exists) {
    db.knex.schema.createTable('urls', function (link) {
      link.string('url', 100);
      link.string('base_url', 100);
      link.string('code', 100);
      link.string('title', 100);
      link.integer('visits');
    }).then(function (table) {
      console.log('Created Table', table);
    });
  }
});

db.knex.schema.hasTable('users').then(function(exists) {
  if(!exists) {
    db.knex.schema.createTable('users', function (user) {
      user.string('username', 100).unique();
      user.string('password', 100);
    }).then(function (table) {
      console.log('Created Table', table);
    });
  }
});

module.exports = db;
