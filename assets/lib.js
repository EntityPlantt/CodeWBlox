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
  const d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
function getCookie(cname) {
  let name = cname + "=";
  let ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return null;
}
function delCookie(cname) {
  setCookie(cname, null, -1);
}
function isValidRegex(str) {
  return /^\w+$/.test(str);
}