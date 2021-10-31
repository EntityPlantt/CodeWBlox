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
function setCookie(cname, cvalue, exdays) {
  window.localStorage.setItem(cname, cvalue);
}
function getCookie(cname) {
  return window.localStorage.getItem(cname);
}
function delCookie(cname) {
  window.localStorage.removeItem(cname);
}
function isValidRegex(str) {
  return /^\w+$/.test(str);
}