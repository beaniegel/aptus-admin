/* Deals with the SERVER part of the login functionality on the site:
   - reads login info from post request using body parser module.
   - finds user in database using database module.
   - creates JSON Web Token for user using auth module.
   - stores JWT in cookie */

// Enable routing between multiple server side js files.
var router = require('express').Router();

// Include required modules.
var db = require('../modules/db');
var auth = require('../modules/auth');

// All requests from user.
router.post('/', handleLogin);

// Handles login authorisation and authentication.
function handleLogin(req, res) {
  var email = req.body.username;
  var password = ['password', req.body.password];
  db.findUser(email, authenticate, password, true);

  function authenticate(err, user) {
    if (err) throw err;
    var approved = 1;
    var status = user.length;
    if (status === approved) {
      var token = auth.generateJWT(user.email);
      storeInCookie(res, token);
      res.send({access: true, token: token});
    }
    else {
      res.send({access: false, token: "Authentication failed."});
    }
  }
}

// Store JSON Web Token in cookie.
function storeInCookie(res, token) {
  res.cookie('auth_token', token, {
    httpOnly: true,
    // secure: true // for production environment only
  });
}

// Export route.
module.exports = router;
