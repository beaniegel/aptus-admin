/* Deals with the SERVER part of the wizard2 functionality. */
/*
// Reference to database object, so that database can be communicated with.
var db = require('../database/db');

// Enabling routing between multiple server side js files.
var router = require('express').Router();

// All prepared statements (to protect against SQL injections).
var nst = db.prepare("INSERT INTO sites (domain, password) VALUES (?,?)");
var chkst = db.prepare("SELECT * FROM sites WHERE domain = ?")

// Handles adding a new client (if no such client already exists).
function handleSite(req, res) {
  // TO DO: validation (partly *maybe completely) already done client side through Bootstrap. Needs more researching.)
  console.log('Entering siteinfo on server');
  chk.all(req.body.domainname, store)

  function store(err, row) {
    noRecord = 0;
    if (err) throw err;

    if (row.length === noRecord) {
      ncl.all(req.body.domainname, req.body.password);
      console.log('A row has been inserted with rowid ${this.lastID}');
      res.send({status: "saved"});
    }
    else {
      res.send({status: "fail"});
    }
  }
}

router.post('/', handleSite);

module.exports = router;
*/
