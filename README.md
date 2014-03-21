# Shortly

Get ready for full-stack app development with Shortly! Shortly is a
URL shortener service similar to Bitly - but it still needs some work.
The application is in very early stages of development with limited
features. Your goal is to make Shortly shine based on the requirements
provided to you by the Tech Lead and Product Manager.  You will be
working on both the server and the client to achieve these goals.

## What's in this Repo

This repo contains a functional URL shortener designed as a single page
app. It's built in Backbone.js client side with a Node/Express-based server.

Client side, the repo includes essential libraries like jQuery,
underscore.js and backbone.js.

This repo includes some basic server specs using Mocha. It is your job to
make all of them pass, but feel free to write additional to guide yourself.
With your server running, enter `mocha [ specfilename ]` to run the tests.

Use nodemon so that the server automatically restarts when you make changes
to your files.

## Reference Material

* [Backbone Router](http://backbonejs.org/#Router)
* [Beginner's guide to REST](http://net.tutsplus.com/tutorials/other/a-beginners-introduction-to-http-and-rest/)
* [REST and RESTful responses](http://pixelhandler.com/blog/2012/02/09/develop-a-restful-api-using-node-js-with-express-and-mongoose/)
* [Overriding Backbone's REST behavior](http://japhr.blogspot.com/2011/10/overriding-url-and-fetch-in-backbonejs.html)
* [Bookshelf.js ORM](http://bookshelfjs.org/)
* [Sessions and Security](http://guides.rubyonrails.org/security.html) - this is a Rails resource, but it's a really good explanation.
* [Knex Queries for Bookshelf](http://knexjs.org/)
* [Handlebars](http://handlebarsjs.com/)
* [Express Authentication and Encryption](http://www.9bitstudios.com/2013/09/express-js-authentication/)
* [HTML5 Pushstate](http://badassjs.com/post/840846392/location-hash-is-dead-long-live-html5-pushstate)

## Your Goals

Basic Requirements:
- Take a few minutes to design your app architecture:
  * [ ] What pages and routes do you want?

- Hook up your app to a SQL database using bookshelf:
  * [ ] Create the necessary tables: urls and clicks
  * [ ] The urls table needs columns: url, visits, base_url, code (the encrypted sha), title, and visits
  * [ ] The clicks table needs columns: created\_at, and link\_id. This will be used later for stat visualization.

- Build a simple authentication system:
  * [ ] Require users to log in to see shortened links
  * [ ] Create a new database table: users
  * [ ] Add a user model with `username`, `passwordHash`, `passwordSalt` and some identifying information (such as an id hash)
  * [ ] Allow users to register for a new accounts, or to login - build pages for login and sign up
  * [ ] Add a `isLoggedIn` helper to all server routes that require login, redirect to a login page as needed
  * [ ] Store the user's identifying information in the session, and auto log-in the user when the user returns

- Add a (backbone) router to the application:
  * [ ] Using HTML5 pushstate, keep the URL in the address bar in sync with what page the user is viewing.
  * [ ] A user should be able to copy a url from the address bar, and then re-enter it into a browser to get back to the original page. Ensure you have a reliable strategy for handling [deep-linked](http://en.wikipedia.org/wiki/Deep_linking) routes on the server.

- Switch to using Handlebars as your template engine:
  * [ ] Include all templates in your index.ejs
  * [ ] On page load, find them, compile and place them into a global object so they can be used in Backbone views (use the name of the template as the key and the compiled template as the value)

Extra Credit:
- Build front-end authentication system:
  * [ ] Handle login within backbone instead of relying on server-side templates and routes. You will need to deliver meaningful errors on the server side, and handle them gracefully on the client side

- [ ] Refactor to use MongoDB and Mongoose

- [ ] Find an image used on the site of the original url and use that instead of an icon (hint: use a regular expression or a [parser](http://stackoverflow.com/questions/7977945/html-parser-on-nodejs) to analyze the document)

- Use Passport for authentication instead of your own:
  * [ ] Swap out your own authentication system for Passport. Use an OAuth provider strategy.

- Create a basic stats page for each link:
  * [ ] Show clicks by time grouped into 5 min intervals (use of HTML tables is ok to satisfy basic requirement)

- Add user-specific stats:
  * [ ] Modify the data schema to support different codes for the same url - so each user can have their own stats for a given url
  * [ ] Change the stats page so it displays the user's clicks along with a total of all clicks in the database for the same url
  * [ ] Visualize your stats using D3

- Precompile your handlebars templates on the server and load them up using a single script tag:
  * [ ] Write a script that precompiles your templates
  * [ ] Stop using ejs entirely
  * [ ] Figure out a strategy to load your precompiled templates on the client


