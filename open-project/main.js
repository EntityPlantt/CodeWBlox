window.onload = function() {
	var projs = getCookie("projects");
	if (projs == null) {
		document.getElementById("radios").innerHTML = "Sorry! You don't have any projects.<br><a href='../editor/index.html'>Get back</a>";
		return;
	}
	projs = projs.split(";");
	if (projs.length < 1 || !(projs instanceof Array)) {
		document.getElementById("radios").innerHTML = "Sorry! You don't have any projects.<br><a href='../editor/index.html'>Get back</a>";
		return;
	}
	for (var i = 0; i < projs.length; i++) {
		var radio = document.createElement("input");
		radio.type = "radio";
		radio.name = "projects";
		radio.id = "proj+" + projs[i];
		var label = document.createElement("label");
		label.innerText = projs[i];
		label.setAttribute("for", "proj+" + projs[i]);
		document.getElementById("radios").appendChild(radio);
		document.getElementById("radios").appendChild(label);
		document.getElementById("radios").appendChild(document.createElement("br"));
	}
}
function loadCode() {
	var fileContent = getCookie(document.querySelector("input[name=projects]:checked").id);
	setCookie("loaded-proj", fileContent, 730);
	location.replace("../editor/index.html");
}