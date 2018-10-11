/* Deals with the CLIENT part of the login functionality on the site. */
"use strict"

var form = document.getElementById("loginForm");
form.addEventListener("submit", login);

// Transform login form input to JSON and send authorisation request to server.
function login(evt) {
  evt.preventDefault();
  var email = document.getElementById("email").value;
  var pwd = document.getElementById("password").value;
  console.log(email + " & " + pwd);
  var loginData = JSON.stringify({
    username: email,
    password: pwd,
  });
  var q = new XMLHttpRequest();
  q.onreadystatechange = receive;
  q.open("POST", "http://localhost:3000/login", true);
  q.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
  q.send(loginData);
}

// Direct user to dashboard after logging in.
function receive() {
  if (this.readyState != XMLHttpRequest.DONE) return;
  window.location.assign("http://localhost:3000/dashboard");
}

//https://css-tricks.com/perfect-full-page-background-image/
window.addEventListener("load", background);

function background(evt) {
	var theWindow        = $(window),
	    $bg              = $("#bg"),
	    aspectRatio      = $bg.width() / $bg.height();
	function resizeBg() {
		if ( (theWindow.width() / theWindow.height()) < aspectRatio ) {
		    $bg
		    	.removeClass()
		    	.addClass('bgheight');
		} else {
		    $bg
		    	.removeClass()
		    	.addClass('bgwidth');
		}
	}
	theWindow.resize(resizeBg).trigger("resize");
}
