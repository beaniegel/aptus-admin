/* Deals with the CLIENT part of the wizard2 functionality. */

"use strict"
var form = document.getElementById("siteForm");
form.addEventListener("submit", site);
window.addEventListener("load", getDomains);

var prevbtn = document.getElementById("prevbtn");
prevbtn.addEventListener("click", goback);

var prev1 = document.getElementById("prev1");
prev1.addEventListener("click", goback);

function goback(evt){
  window.location.assign("http://localhost:3000/wizard/clients");
}

function site(evt) {
  evt.preventDefault();
  var domainname = document.getElementById("domainname").value;
  var password = document.getElementById("password").value;
  console.log(domainname + " & " + password);
  var siteData = JSON.stringify({
    domainname: domainname,
    password: password
  });

  var q = new XMLHttpRequest();
  q.onreadystatechange = receive;
  q.open("POST", "http://localhost:3000/wizard/site/add", true);
  q.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
  q.send(siteData);
}

function receive() {
  if (this.readyState != XMLHttpRequest.DONE) return;
  var stored = JSON.parse(this.responseText);
  if (stored.status === "saved") {
    window.location.assign("http://localhost:3000/dashboard");
    return;
  }
  window.location.assign("http://localhost:3000/wizard/site");
}

function getDomains(evt) {
  var r = new XMLHttpRequest();
  r.onreadystatechange = receiveDomains;
  r.open("GET", "http://localhost:3000/wizard/getdomains", true);
  r.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
  r.send();
}

function receiveDomains() {
  if (this.readyState != XMLHttpRequest.DONE) return;
  //console.log(this.responseText);
  var d = JSON.parse(this.responseText);
  loaddomain(d);
}

function loaddomain(d){

  var doms = d.doms;
  var dlen = doms.length

  var dn = document.getElementById("domainname");

  for(var i=0; i < dlen; i++){
    var opt = doms[i]
    dn[i] = new Option(opt);
  }
}

/*
var property = document.createElement("select");
property.id = "predicate(" + addprop.level + "," + addprop.count + ")";
property[property.length] = new Option("Properties", "");
var options = response.getElementsByTagName('option');*/
