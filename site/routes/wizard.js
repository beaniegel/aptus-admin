/* Deals with the SERVER part of all wizard functionality:
   - serving html pages requested by the user.
   - serving client and domain JSON to display on dynamic pages.
   - adding new clients to the database using db module.
   - delete existing client from the database using db module.
   - adding new clients to the database using db module.               */

// Include required modules.
var router = require('express').Router();
var path = require('path');
var db = require('../modules/db');

// All get requests.
router.get('/', wizard);
router.get('/client', existingClient);
router.get('/client/new', newClient);
router.get('/site', createSite)
router.get('/getdomains', getDomains);
router.get('/getclients', getClients);
router.post('/4', getcldata);
router.get('/5', loadcldata);

function loadcldata(req, res){
 db.fetchNames(sendClients);
//storing as arrays
 function sendClients(err, results){
   if (err) throw err;
   console.log(results);
   if(results.length>0) {
     var names = results.map(e=>e.name);
     res.send({names: names});
   }
   else{res.send({});}
 }
}

function getcldata(req, res){
 var company = req.body.clname;

 db.findClient(company, getClients);
//storing as arrays
 function getClients(err, client){
   if (err) throw err;
   console.log(client);
   if(client.length>0) {
     clientId = client[0].rowid;

     console.log('clientid saved = ', client);
     console.log(clientId);
     res.send({status: "saved"});
   }
   else{res.send({});}
 }
}

// Serve wizard entry page
function wizard(req, res) {
  var html = path.resolve(__dirname, '../html/wizard.html');
  res.sendFile(html);
}

// Serve page for new clients.
function newClient(req, res) {
  var html = path.resolve(__dirname, '../html/new.html');
  res.sendFile(html);
}

// Serve page for existing clients.
function existingClient(req, res) {
  var html = path.resolve(__dirname, '../html/existing.html');
  res.sendFile(html);
}

// Serve creating site page.
function createSite(req, res) {
  var html = path.resolve(__dirname, '../html/site.html');
  res.sendFile(html);
}

// Serve list of all existing clients.
function getClients(req, res) {
  db.fetchClients(sendClients);
  function sendClients(err, client){
    if (err) throw err;
    console.log(client);
    if(client.length>0) {
      var ids = client.map(e=>e.id)
      var names = client.map(e=>e.name);
      var emails = client.map(e=>e.email);
      var people = client.map(e=>e.person);
      var phones = client.map(e=>e.phone);
      res.send({ids: ids, names: names, emails: emails, people: people, phones: phones});
    }
    else{ res.send({}); }
  }
}

function fetchNames(req, res) {

}

// Serve list of all available domains.
function getDomains(req, res){
  db.findDomains(response);
  function response(err, domains){
    if (err) throw err;
    if(domains.length > 0){
      var doms = domains.map(e=>e.name);
      res.send({doms: doms});
    }
    else { res.send({}); }
  }
}

// All post requests.
router.post('/client/add', handleClient);
router.post('/site/add', handleSite);
router.post('/delete', deleteClient);

var clientId;

// Create new client (if no such client already exists).
function handleClient(req, res) {
  var company = req.body.compname;
  var email = req.body.email;
  var contact = req.body.contact;
  var phone =  req.body.phone;
  db.findClient(company, storeClient);
  function storeClient(err, match) {
    if (err) throw err;
    var newClient = 0;
    var client = match.length;
    if (client === newClient) {
      db.addClient(company, email, contact, phone, checkSuccess);
      function checkSuccess(err, empty) {
        if (err) throw err;
        db.findClient(company, saveId);
        function saveId (err, client) {
          if (err) throw err;
          clientId = client[0].rowid;
          res.send({status: "saved"});
        }
      }
    }
    else {
      res.send({status: "failed"});
    }
  }
}

// Create new site instance with corresponding ClientID.
function handleSite(req, res) {
  db.isAvailable(req.body.domainname, storeSite);
  function storeSite(err, domain) {
    var available = 1;
    if (err) throw err;
    if (domain.length === available) {
      db.addSite(clientId, req.body.domainname, req.body.password, savedSite);
      function savedSite(err) {
        if (err) throw err;
        res.send({status: "saved"});
      }
    }
    else {
      res.send({status: "fail"});
    }
  }
}

// Delete client from database using database module.
function deleteClient(req, res){
  db.deleteClient(clientId);
}

module.exports = router;
