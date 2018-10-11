var crypto = require('crypto');

function generateJWT(username) {
  var b64Header = createBase64Header();
  var b64Payload = createBase64Payload(username);
  var b64Signature = createSignature(b64Header, b64Payload);
  var token = b64Header + "." + b64Payload + "." + b64Signature;
  console.log("token = " + token);
  return token;
}

function createBase64Header() {
  var header = {
    typ: "JWT",
    alg: "HS256"
  };
  var headerJSON = JSON.stringify(header);
  var b64Header = new Buffer(headerJSON).toString('base64');
  var b64urlHeader = b64tob64url(b64Header);
  return b64urlHeader;
}

function createBase64Payload(username) {
  var payload = {
    sub: "login",
    name: username,
    exp: Math.floor(Date.now()/1000) + 28800 // valid for 8 hours after issuing
  };
  var payloadJSON = JSON.stringify(payload);
  var b64Payload = new Buffer(payloadJSON).toString('base64');
  var b64urlPayload = b64tob64url(b64Payload);
  return b64urlPayload;
}

function createSignature(b64Header, b64Payload) {
  var encryptAndEncode = crypto.createHmac('sha256', 'jwtsecret')
                               .update(b64Header + '.' + b64Payload)
                               .digest('base64');
  var signature = b64tob64url(encryptAndEncode);
  return signature;
}

function b64tob64url(stringB64) {
  var urlfriendly = stringB64.replace(/\+/g, '-')
                             .replace(/\//g, '_')
                             .replace(/\=+$/, '');
  return urlfriendly;
}

function isValid(jwt) {
  var token = jwt.split('.');
  var header = 0, payload = 1, signature = 2;
  var verifiedSignature = createSignature(token[header], token[payload]);
  if (!tokenExpired(token[payload]) &&
      token[signature] === verifiedSignature) {
    return true;
  }
  return false;
}

function tokenExpired(encodedPayload) {
  var buff = new Buffer(encodedPayload, 'base64');
  var decoded = buff.toString('ascii');
  var payload = JSON.parse(decoded);
  var currTime = Math.floor(Date.now()/1000);
  if (payload.exp < currTime) {
    return true;
  }
  return false;
}

module.exports = { generateJWT: generateJWT,
                   isValid: isValid }
