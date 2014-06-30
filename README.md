# Shortly

Get ready for full-stack app development with Shortly! Shortly is a URL shortener service similar to Bitly - but is only partially finished. Your goal is to build out an authentication system and other features that will enable users to have their own private set of shortened URLs.

You will need to think about how to approach authentication from both a user perspective and a technical perspective. Some questions to think about:

1. How do I store user and password information securely?
2. What additional steps will the user need to take when interacting with the application? More specifically, what additional routes will the application need to handle?
3. What strategies do I need to employ to secure existing site functionality?
4. How often should the user need to enter their username + password?

## What's in this Repo

This repo contains a functional URL shortener designed as a single page app. It's built using Backbone.js on the client with a Node/Express-based server. The server uses the Bookshelf.js ORM and EJS for templates.

Client side, the repo includes essential libraries like jQuery, underscore.js and backbone.js. Templating on the client is handled via Handlebars.

This repo includes some basic server specs using Mocha. It is your job to make all of them pass, but feel free to write additional tests to guide yourself. With your server running, enter `mocha [ specfilename ]` to run the tests.

Use nodemon so that the server automatically restarts when you make changes to your files.

## Reference Material

* [Express Authentication and Encryption](http://www.9bitstudios.com/2013/09/express-js-authentication/)
* [Sessions and Security](http://guides.rubyonrails.org/security.html) - this is a Rails resource, but it's a really good explanation.
* [Bookshelf.js ORM](http://bookshelfjs.org/)
* [Knex Queries for Bookshelf](http://knexjs.org/)
* [Handlebars](http://handlebarsjs.com/)
* [Beginner's guide to REST](http://net.tutsplus.com/tutorials/other/a-beginners-introduction-to-http-and-rest/)
* [REST and RESTful responses](http://pixelhandler.com/blog/2012/02/09/develop-a-restful-api-using-node-js-with-express-and-mongoose/)
* [HTML5 Pushstate](http://badassjs.com/post/840846392/location-hash-is-dead-long-live-html5-pushstate)
* [Backbone Router](http://backbonejs.org/#Router)

## Your Goals

### Basic Requirements:

- Build a simple authentication system - from scratch:
  * [ ] Create a new table `users` with columns `username` and `password`. Consider how you will store this information securely. What models will you need and what behavior will they encapsulate?
  * [ ] Allow users to register for a new account, or to login - build pages for login and sign up, and add routes to process the form data using POST actions.
  * [ ] Add a `checkUser` helper to all server routes that require login, redirect the user to a login page as needed. Require users to log in to see shortened links and create new ones. Do NOT require the user to login when using a previously shortened link.
  * [ ] Enable sessions so that the user does not need to keep logging in when reloading the page.
  * [ ] Don't forget to give the user a way to log out!

### Extra Credit:

- Build a front-end authentication system:
  * [ ] Handle all login and signup from backbone instead of relying on server-side redirects and routes.
  * [ ] Convert your server routes into API endpoints. You will need to deliver meaningful errors on the server side, and handle them gracefully on the client side.

- Add a (backbone) router to move the user from page to page:
  * [ ] Using HTML5 pushstate, keep the URL in the address bar in sync with what page the user is viewing.
  * [ ] A user should be able to copy a url from the address bar, and then re-enter it into a browser to get back to the original page. Ensure you have a reliable strategy for handling [deep-linked](http://en.wikipedia.org/wiki/Deep_linking) routes on the server.

- Add error messages:
  * [ ] Let your users know when they've entered incorrect credentials or fail to properly register for a user account.

### Nightmare Mode:

#### Passport

Passport is authentication middleware for Node.js.  
  * [ ] Now that you fully understand the way a server-side auth system works,swap out your own system for [Passport](http://passportjs.org/). Use an OAuth provider strategy; login via your GitHub account.
    * NOTE: Passport will conflict with any client-side auth system you've aleady implemented, so be ready to disable it. 

### Other Challenges

The following challenges are not core to the sprint but if you have time you can give them a try:

- Make your site prettier:
  * [ ] Find an image used on the site of the original url and use that instead of the generic icon (hint: use a regular expression or a [parser](http://stackoverflow.com/questions/7977945/html-parser-on-nodejs) to analyze the HTML document). How will you store this new information?

- Create a basic stats page for each link:
  * [ ] Show clicks by time grouped into 5 min intervals (displayed as a table is ok).
  * [ ] Add additional models, routes, views, templates as needed.

- Add user-specific stats:
  * [ ] Modify the data schema to support different codes for the same url - so each user can have their own stats for a given url
  * [ ] Change the stats page so it displays the user's clicks along with a total of all clicks in the database for the same url
  * [ ] Visualize your stats using D3

- Don't use two different templating systems:
  * [ ] Switch to using Handlebars as your template engine on both client and server.
  * [ ] Write a script that precompiles your templates on the server and loads them in the client using a single script tag
  * [ ] Stop using ejs entirely
