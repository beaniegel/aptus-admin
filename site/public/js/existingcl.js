"use strict"

window.addEventListener("load", getclients);

var form = document.getElementById("clexist");
form.addEventListener("submit", client);

var prevbtn = document.getElementById("prev-btn");
prevbtn.addEventListener("click", prevpage);

var newbtn = document.getElementById("btn-addnew");
newbtn.addEventListener("click", gotonew);

function client(evt) {
  evt.preventDefault();
  var clname = document.getElementById("clientlist").value;
  //var password = document.getElementById("password").value;
  //console.log(domainname + " & " + password);
  var clData = JSON.stringify({
    clname: clname,
  //  password: password,
  });

  var q = new XMLHttpRequest();
  q.onreadystatechange = receive;
  q.open("POST", "http://localhost:3000/wizard/4", true);
  q.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
  q.send(clData);
}

function receive() {
  if (this.readyState != XMLHttpRequest.DONE) return;
  console.log(this.responseText);
  var stored = JSON.parse(this.responseText);
  if (stored.status === "saved") {
    window.location.assign("http://localhost:3000/wizard/site");
  }
  else {
    window.location.assign("http://localhost:3000/wizard/client");
  }
  }

 function getclients(evt) {
   var r = new XMLHttpRequest();
   r.onreadystatechange = receiveclients;
   r.open("GET", "http://localhost:3000/wizard/5", true);
   r.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
   r.send();
 }

 function receiveclients() {
   if (this.readyState != XMLHttpRequest.DONE) return;
   //console.log(this.responseText);
   var cl = JSON.parse(this.responseText);
   loadclients(cl);
 }

 function loadclients(cl){

   var cls = cl.names;
   var clen = cls.length
   var cll = document.getElementById("clientlist");
   for(var i=0; i < clen; i++){
     var opt = cls[i]
     cll[i] = new Option(opt);
   }
 }

 function prevpage(evt) {
   window.location.assign("http://localhost:3000/wizard/");
 }
 function gotonew(evt) {
   window.location.assign("http://localhost:3000/wizard/client/new");
 }




/*
"use strict"

window.addEventListener("load", getClients);
var search = document.getElementById("searchForm");
search.addEventListener("submit", searchTable);

//requesting rows data
 function getClients() {
   var q = new XMLHttpRequest();
   q.onreadystatechange = receiveClients;
   q.open("GET", "http://localhost:3000/wizard/getclients", true);
   q.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
   q.send();
   console.log("data requested");
 }

//receiving rows data
 function receiveClients(evt) {
   if (this.readyState != XMLHttpRequest.DONE) return;
   var clients = JSON.parse(this.responseText);
   console.log("data is here");
   parseClients(clients);
 }

//creating a table
function parseClients(data) {
    console.log('data = ', data);
    var table = document.getElementById("clienttable");

    var ids = data.ids;
    var names = data.names;
    var emails = data.emails;
    var people = data.people;
    var phones = data.phones;
    var num = ids.length

    var tableBody = document.createElement('TBODY');
    table.appendChild(tableBody);

    for (var i=0; i<num; i++){

        var tr = document.createElement('TR');
        tableBody.appendChild(tr);

        var id = document.createElement('TD');
        var name = document.createElement('TD');
        var email = document.createElement('TD');
        var person = document.createElement('TD');
        var phone = document.createElement('TD');

        id.appendChild(document.createTextNode(ids[i]));
        name.appendChild(document.createTextNode(names[i]));
        email.appendChild(document.createTextNode(emails[i]));
        person.appendChild(document.createTextNode(people[i]));
        phone.appendChild(document.createTextNode(phones[i]));

        tr.appendChild(id);
        tr.appendChild(name);
        tr.appendChild(email);
        tr.appendChild(person);
        tr.appendChild(phone);
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

function prevpage(evt) {
  window.location.assign("http://localhost:3000/wizard/client");
}

function gotonew(evt) {
  window.location.assign("http://localhost:3000/wizard/client/new");
}
*/
