"use strict"

window.addEventListener("load", getTable);
var news = document.getElementById("nsbtn");
news.addEventListener("click", addSite);
var search = document.getElementById("searchForm");
search.addEventListener("submit", searchTable);

// Request dashboard info.
 function getTable() {
   var r = new XMLHttpRequest();
   r.onreadystatechange = receiveTable;
   r.open("GET", "http://localhost:3000/dashboard/view", true);
   r.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
   r.send();
   console.log("data requested");
 }

// Receive dashboard info.
 function receiveTable(evt) {
   if (this.readyState != XMLHttpRequest.DONE) return;
   var rows = JSON.parse(this.responseText);
   console.log("data is here", rows);
   parseTable(rows);
 }

// Parse dashboard info.
function parseTable(put) {
  var tableBody = document.createElement('TBODY');
  var table = document.getElementById("clienttable").appendChild(tableBody);
  var max = put.ids.length

  for (var i=0; i<max; i++){
    var tr = document.createElement('TR');
    tableBody.appendChild(tr);
    var id = document.createElement('TD');
    var domain = document.createElement('TD');
    var name = document.createElement('TD');
    var email = document.createElement('TD');
    id.appendChild(document.createTextNode(put.ids[i]));
    domain.appendChild(document.createTextNode(put.domains[i]));
    name.appendChild(document.createTextNode(put.names[i]));
    email.appendChild(document.createTextNode(put.emails[i]));
    tr.appendChild(id);
    tr.appendChild(domain);
    tr.appendChild(name);
    tr.appendChild(email);
  }
}

// Search dashboard for specific value.
function searchTable(evt) {
  evt.preventDefault();
  var input = document.getElementById('searchInput');
  var reqValue = input.value;
  var table = document.getElementById('clienttable').childNodes[3].childNodes;
  var cols = table.length, rows = table[0].childNodes.length;
  var found = 0;

  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      var cell = table[i].childNodes[j].innerHTML;
      if (cell.indexOf(reqValue) >= found) {
        var match = true;
        j = cols;
        table[i].classList.remove("hide");
      }
    }
    if (!match) {
      table[i].classList.add("hide");
    }
    match = false;
  }
}

// Direct client to wizard.
function addSite(evt){
   window.location.assign("http://localhost:3000/wizard");
}
