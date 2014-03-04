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

Just like in shortener, this repo includes some basic server specs.
Out of the box, all specs should pass. Ensure that as you make changes
to your server, you update specs and keep them in sync with your code.

Client side, the repo includes essential libraries like jQuery,
underscore.js and backbone.js.

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

- Sorting and Filtering:
  * [ ] Display the links on the listing page sorted by visit count
  * [ ] Add a filter/search box to display only those items whose name matches the criteria
  * [ ] Show the last visited timestamp, allow the user to re-sort entries in the listing page by last visited time or visit count

- Create a stats page for each link:
  * [ ] Show clicks by time grouped into 5 min intervals (use of HTML tables is ok to satisfy basic requirement)

- Add a (backbone) router to the application:
  * [ ] Using HTML5 pushstate, keep the URL in the address bar in sync with what page the user is viewing.
  * [ ] A user should be able to copy a url from the address bar, and then re-enter it into a browser to get back to the original page. Ensure you have a reliable strategy for handling deep-linked routes on the server.

- Shorten new Links feature:
  * [ ] Incorporate the "shorten new link" feature into the listing page (instead of being on its own page)
  * [ ] On success, insert the newly created link at the top of the listing page. If it already exists, alert the user with a gentle reminder.

- Switch to using Handlebars as your template engine:
  * [ ] Include all templates in your index.ejs
  * [ ] On page load, find them, compile and place them into a global object so they can be used in Backbone views (use the name of the template as the key and the compiled template as the value)

- Build a simple authentication system:
  * [ ] Require users to log in to see shortened links
  * [ ] Add a user model with `username`, `passwordHash`, `passwordSalt` and some identifying information (such as an id hash)
  * [ ] Allow users to register for a new accounts, or to login - build pages for login and sign up
  * [ ] Add a `loggedIn` helper to all server routes that require login, redirect to a login page as needed
  * [ ] Store the user's identifying information in the session, and auto log-in the user when the user returns

Extra Credit:

- Shorten new Links feature:
  * [ ] When the user tries to shorten a link that already exists, move that link to the top of the listing page without adjusting the order of any other items.

- Build front-end authentication system:
  * [ ] Handle login within backbone instead of relying on server-side templates and routes. You will need to deliver meaningful errors on the server side, and handle them gracefully on the client side

- Use OmniAuth for authentication instead of your own:
  * [ ] Swap out your own authentication system for Passport. Use an OAuth provider strategy.

- Add user-specific stats:
  * [ ] Modify the data schema to support different codes for the same url - so each user can have their own stats for a given url
  * [ ] Change the stats page so it displays the user's clicks along with a total of all clicks in the database for the same url
  * [ ] Visualize your stats using D3

- [ ] Find an image used on the site of the original url and use that instead of an icon (hint: use a regular expression or a [parser](http://stackoverflow.com/questions/7977945/html-parser-on-nodejs) to analyze the document)

- [ ] Deploy your application to Azure.
