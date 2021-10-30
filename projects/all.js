window.onload = function() {
	document.getElementById("projects").innerHTML = "";
	ForEachProjectOnSite(function(i, text) {
		var li = document.createElement("li");
		var a = document.createElement("a");
		a.href = "https://entityplantt.github.io/CodeWBlox/editor.html?" + i;
		a.innerText = "Project " + i;
		li.appendChild(a);
		document.getElementById("projects").appendChild(li);
	});
	if (document.getElementById("projects").innerHTML == "")
		document.getElementById("projects").innerHTML = "No projects uploaded yet.<br>Sorry 😟";
}