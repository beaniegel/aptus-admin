/* Deals with the CLIENT part of the wizard functionality. */

"use strict"
var form = document.getElementById("clientForm");
form.addEventListener("submit", client);

var prevbtn = document.getElementById("prev-btn");
prevbtn.addEventListener("click", prevpage);

function client(evt) {
  evt.preventDefault();
  var compname = document.getElementById("companyname").value;
  var contact = document.getElementById("contact").value;
  var email = document.getElementById("email").value;
  var phone = document.getElementById("phone").value;
  console.log(compname + " & " + contact + " & " + email + " & " + phone);
  var clientData = JSON.stringify({
    compname: compname,
    contact: contact,
    email: email,
    phone: phone,
  });

    var q = new XMLHttpRequest();
    q.onreadystatechange = receive;
    q.open("POST", "http://localhost:3000/wizard/client/add", true);
    q.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
    q.send(clientData);
  }

  function receive() {
    if (this.readyState != XMLHttpRequest.DONE) return;
    console.log(this.responseText);
    var stored = JSON.parse(this.responseText);
    ifexists(stored);
  }

  // Updates URL according to access status.
  function ifexists(stored) {
    if (stored.status === "saved") {
      window.location.assign("http://localhost:3000/wizard/site");
      return;
    }
    window.location.assign("http://localhost:3000/wizard/client");
  }

  function prevpage(evt) {
    window.location.assign("http://localhost:3000/wizard");
  }
