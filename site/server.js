/* Deals with overall SERVER side functionality of the website, e.g.:
   - creates Express application instance.
   - includes all required modules
   - creates specific route for every server side request
   - lets application listen on port 3000                                 */

// Include required middleware, routes and external modules.
var express = require('express');
var bodyParser = require('body-parser');
var auth = require('./middleware/auth');
var loginRoute = require('./routes/login');
var wizardRoute = require('./routes/wizard');
var dashRoute = require('./routes/dashboard');

// Create express instance.
var app = express();

// Use express to get static pages from public (all routes).
app.use(express.static('public'));

// use body parser to parse json bodies (all routes).
app.use(bodyParser.json());

// Defining all routes.
app.use('/login', loginRoute);
app.use('/wizard', auth, wizardRoute);
app.use('/dashboard', auth, dashRoute);

// Client requests with no routes.
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/html/index.html');
});
app.get('/denied', function(req, res) {
  res.sendFile(__dirname + '/html/denied.html');
});

// Application listens on port 3000.
app.listen(3000);
