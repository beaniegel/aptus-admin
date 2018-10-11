/* Deals with connection between server and database. */
var sqlite = require("sqlite3");

// Connect the server to the embedded database.
var db = new sqlite.Database("./database/data.db");

/* Find user, client or site in database with specific attribute.
attribute needs to be an array such as [record1, value1, record2, value2].
To set connector between attribute to "AND", set optionalAnd to true.
Default connector is "OR" */

function findUser(email, callback, optionalAttr, optionalAnd) {
  find('id, email', 'users', 'email', email, callback, optionalAttr, optionalAnd);
}

function findClient(name, callback) {
  console.log('entering findclient');
  find('rowid', 'clients', 'name', name, callback);
}

function findDomains(callback) {
  console.log('entering domains');
  find('name', 'domains', 'used', '0', callback);
}

function isAvailable(domain, callback) {
  console.log('entering dom availability');
  available = ['used', 0]
  find('name', 'domains', 'name', domain, callback, available, true);
}

function find(row, table, record, attribute, callback, optionalAttr, optionalAnd) {
  console.log('entering find');
  if (attribute.constructor !== String) {
    throw new Error('First parameter should be a String.');
  }
  var sql = 'SELECT ' + row + ' FROM ' + table + ' WHERE ' + record + '= ?';
  if (optionalAttr !== undefined) {
    multiAttr(sql, attribute, optionalAttr, optionalAnd, callback);
  }
  else {
    console.log('ps = ', sql, attribute)
    var ps = db.prepare(sql);
    console.log('exiting find');
    ps.all(attribute, callback);
  }
}

function multiAttr(sql, attribute, optionalAttr, optionalAnd, callback) {
  if (optionalAttr.constructor !== Array) {
    throw new Error('optionalAttr should be an array, e.g. [record, value].');
  }
  sql = sql + setConnector(optionalAnd) + ' ' + optionalAttr[0] + '=?';
  var multiVal = [attribute, optionalAttr[1]];
  var ps = db.prepare(sql);
  ps.all(multiVal, callback);
}

function setConnector(optionalAnd) {
  if (typeof optionalAnd !== 'undefined') {
    if (optionalAnd === true) {
      return 'AND';
    }
  }
  return 'OR';
}

function addClient(name, email, contact, phone, callback) {
  var record = '(name, email, person, phone)';
  var values = [name, email, contact, phone];
  add('clients', record, values, callback);
}

function addSite(client, domain, password, callback) {
  console.log('entering add site');
  var record = '(client, domain, password)';
  var values = [client, domain, password];
  add('sites', record, values, callback);
  markAsUsed(domain);
  console.log('exiting ');
}

function markAsUsed(domain) {
  console.log('entering markasused');
  ps = db.prepare('UPDATE domains SET used = 1 WHERE name = ?');
  ps.all(domain, errCheck);
  console.log('exiting markasUsed');
}

function errCheck(err, row) {
  console.log('domain status updated');
  if (err) throw err;
  console.log('exiting errcheck');
}

function add(table, record, values, callback) {
  console.log('entering add');
  var psValues = setPsValue(values);
  var sql = 'INSERT INTO ' + table + record + ' VALUES(' + psValues + ')';
  console.log('sql = ', sql);
  var ps = db.prepare(sql);
  ps.all(values, callback);
  console.log('exiting add');
}

function setPsValue(values) {
  console.log('entering set ps value');
  var i;
  var psValue = '?';
  if (values.constructor === Array) {
    var arr = [];
    for (i = 0; i < values.length; i++) {
      arr.push(psValue);
    }
    psValue = arr.join(',');
  }
  console.log('exiting psvalue');
  return psValue;
}

function prepare(string) {
  return true;
}

function deleteClient(rowid, callback) {
  var ps = db.prepare('DELETE FROM clients WHERE rowid = ?');
  ps.all(rowid, callback);
  console.log('deleted client');
}

function sitesCount(callback) {
  count('sites', callback);
}

function clientsCount(callback) {
  count('clients', callback);
}

function count(value, callback) {
  var ps = db.prepare('SELECT COUNT(*) c FROM ' + value);
  ps.all(callback);
}

function fetchDashboard(callback) {
  var ps = db.prepare('SELECT clients.rowid id, sites.domain domain,' +
                      'clients.name name, clients.email email FROM sites ' +
                      'INNER JOIN clients on sites.client = clients.rowid');
  ps.all(callback);
}

function fetchClients(callback) {
  var ps = db.prepare('SELECT clients.rowid id, clients.person person, ' +
                      'clients.email email FROM clients');
  ps.all(callback);
}


function fetchNames(callback) {
  var ps = db.prepare('SELECT clients.name name FROM clients');
  ps.all(callback);
}




module.exports = { findUser: findUser,
                   findClient: findClient,
                   addClient: addClient,
                   addSite: addSite,
                   findDomains: findDomains,
                   isAvailable: isAvailable,
                   deleteClient: deleteClient,
                   clientsCount: clientsCount,
                   sitesCount: sitesCount,
                   count: count,
                   fetchDashboard: fetchDashboard,
                   fetchNames: fetchNames,
                   fetchClients: fetchClients
                }
