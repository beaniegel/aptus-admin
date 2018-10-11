/* Deals with the CLIENT part of the wizard functionality. */
"use strict"

var existingCl = document.getElementById("oldimg");
existingCl.addEventListener("click", existingClient);
var newCl = document.getElementById("newimg");
newCl.addEventListener("click", newClient);
var btnback = document.getElementById("btn-back");
btnback.addEventListener("click", dashboard);


function existingClient(evt) {
  window.location.assign("/wizard/client/");
}

function newClient(evt) {
  window.location.assign("/wizard/client/new");
}

function dashboard(evt) {
  window.location.assign("/dashboard");
}
