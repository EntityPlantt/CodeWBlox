function readFile(extension, afterCode) {
  var getFile = document.createElement("input");
  getFile.type = "file";
  getFile.setAttribute("accept", extension);
  getFile.onchange = function(e) {
  	var file = new FileReader();
    file.onload = function() {
      afterCode(file.result);
    }
  	file.readAsText(e.target.files[0]);
  }
  getFile.click();
}
function saveFile(name, extension, content) {
  var downloadLink = document.createElement("a");
  downloadLink.href = "data:text/plain," + encodeURIComponent(content);
  var downloadName = name;
  if (downloadName == null)
    return;
  if (downloadName.indexOf(extension) != downloadName.length - extension.length) // if the extension is not given
    downloadName += extension;
  downloadLink.download = downloadName;
  downloadLink.click();
}
function uploadFileToGithub(repository, branchName, filename, content, commitTitle) {
   return new Promise(function(resolve, reject) {
      repository.write(
         branchName,
         filename,
         content,
         commitTitle,
         function(err) {
            if (err) {
               reject(err);
            } else {
               resolve(repository);
            }
         }
      );
   });
}
function hasValue(variable) {
  return (variable != null) && (variable != undefined);
}
function doesFileExist(urlToFile) {
  var xhr = new XMLHttpRequest();
  xhr.open('HEAD', urlToFile, false);
  xhr.send();
  return !(xhr.status == "404");
}
function NumberOfProjectsOnSite() {
  var nop = 1;
  while (doesFileExist("https://entityplantt.github.io/CodeWBlox/uploaded_projects/" + nop + ".cwb")) nop++;
  return nop;
}
function ForEachProjectOnSite(func) {
  var nop = 1;
  while (doesFileExist("https://entityplantt.github.io/CodeWBlox/uploaded_projects/" + nop + ".cwb")) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://entityplantt.github.io/CodeWBlox/uploaded_projects/" + nop + ".cwb", true);
    xhr.send(null);
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4 && xhr.status == 200) {
        var type = xhr.getResponseHeader("Content-Type");
        if (type.indexOf("text") > -1) {
          func(nop, xhr.responseText);
        }
      }
    }
    nop++;
  }
}