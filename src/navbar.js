/* this script loads navigation-bar.html file synchronously and inserts it as navigation bar */

const xhr = new XMLHttpRequest();
xhr.open("GET", "/navigation-bar.html", false);
xhr.onload = function() {
	document.write(xhr.responseText);
}
xhr.send();