/* Middleware that deals with the authentication of restricted access pages,
   this includes:
   - cookie unpacking.
   - token validation.
   - page handling after authentication.                                     */

// Including relevant modules.
var path = require('path');
var auth = require('../modules/auth');

// Authenticates user and allows or denies access to requested page.
function authentication(req, res, next) {
  var cookie = req.headers.cookie;
  if (cookie == undefined) {
    AccessDenied(res);
  }
  else if (validTokenInside(cookie) === true) {
    return next();
  }
  AccessDenied(res);
}

// Unpacks cookie and validates jwt using auth module.
function validTokenInside(cookie) {
  var tokenIndex = 1;
  var accesToken = 'auth_token=';
  if (cookie.indexOf(accesToken) == 0) {
    var CookieArray = cookie.split('auth_token=');
    var token = CookieArray[tokenIndex];
    return auth.isValid(token);
  }
  return false
};

// Directs user to access denied page, using path module.
function AccessDenied(res) {
  var noAccess = path.resolve(__dirname, '../html/denied.html');
  res.sendFile(noAccess);
}

// Export this middleware
module.exports = authentication;
