/* Server side handling of the following dashboard related functionality:
  - serving dashboard page to users
  - posting dashboard info to client side.                               */

// Include required modules;
var router = require('express').Router();
var path = require('path');
var db = require('../modules/db.js');

// All user requests.
router.get('/view', handleTable);
router.get('/', function (req, res) {
  var html = path.resolve(__dirname, '../html/dashboard.html');
  res.sendFile(html);
});

// Request dashboard from database and send to user.
function handleTable(req, res) {
    db.fetchDashboard(sendDashboard);

    function sendDashboard(err, results){
      if (err) throw err;
      console.log(results);
      if(results.length>0) {
        var ids = results.map(e=>e.id);
        var domains = results.map(e=>e.domain);
        var names = results.map(e=>e.name);
        var emails = results.map(e=>e.email);

        res.send({ids: ids, domains: domains, names: names, emails: emails});
      }
      else{res.send({});}
    }
}

module.exports = router;
