var canvas, blocks, selectedBlocks = new Array(), intervals = new Array(), gradients = new Array();
var confirmMessage = "It looks like you have unsaved changes. Do you want to exit?";
var ctrlKeyPressEvent = {
  on: function(key, func) {
    this["key." + key] = func;
  },
  run: function(key) {
    this["key." + key]();
  }
};

var changes, nowChange = 0, savedChange;
function changeIsMade() {
  if (nowChange < changes.length - 1)
    changes = changes.slice(0, nowChange + 1);
  nowChange++;
  changes.push(document.getElementById("space").innerHTML);
}
function setSaved() {
  savedChange = changes[nowChange];
}

window.addEventListener("beforeunload", function(event) {
  if (savedChange != changes[nowChange]) {
    (event || window.event).returnValue = confirmMessage; // IE
    return confirmMessage; // Safari, Webkit, Chrome...
  }
});
window.onload = function() {
  canvas = document.getElementById("preview").getContext("2d");
  blocks = document.querySelectorAll("templates[name='blocks'] template");
  setInterval(function() {
    for (var i = 0; i < document.querySelectorAll("[draggable]").length; i++) {
      dragElement(document.querySelectorAll("[draggable]")[i]);
    }
    for (var i = 0; i < document.querySelectorAll("div.block input").length; i++) {
      document.querySelectorAll("div.block input")[i].setAttribute("value", document.querySelectorAll("div.block input")[i].value);
      document.querySelectorAll("div.block input")[i].onchange = function() {
        changeIsMade();
      }
    }
    document.getElementById("unsavedChanges").style.display = (savedChange != changes[nowChange]) ? "block" : "none";
  }, 42);
  for (var i = 0; i < blocks.length; i++) {
    blocks[i].content.querySelectorAll("div.block")[0].onclick = function() {
      var node = this.cloneNode(true);
      node.setAttribute("draggable", true);
      node.style.position = "absolute";
      var selectButton = document.createElement("button");
      selectButton.className = "selectButton";
      selectButton.setAttribute("onclick", "selectBlock(this.parentElement);");
      selectButton.innerText = "Select";
      node.appendChild(selectButton);
      document.getElementById("space").appendChild(node);
      changeIsMade();
    };
    document.getElementById("blocks").append(blocks[i].content);
  }
  if (getCookie("projects") == null) {
    setCookie("projects", "", 730);
    delCookie("loaded-proj");
  }
  if (getCookie("loaded-proj") != null) {
    document.getElementById("space").innerHTML = getCookie("loaded-proj");
    delCookie("loaded-proj");
  }
  document.onkeydown = function(e) {
    e = e || window.event;
    if (e.ctrlKey)
      ctrlKeyPressEvent.run(e.keyCode);
  }
  changes = [document.getElementById("space").innerHTML];
  savedChange = document.getElementById("space").innerHTML;
}

function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  elmnt.onmousedown = dragMouseDown;

  if (elmnt.getAttribute("draggable") == null)
    elmnt.onmousedown = null;

  function dragMouseDown(e) {
    e = e || window.event;
    if (document.elementFromPoint(e.clientX, e.clientY).nodeName != "INPUT" && document.elementFromPoint(e.clientX, e.clientY).nodeName != "SELECT") {
      e.preventDefault();
      // get the mouse cursor position at startup:
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      // call a function whenever the cursor moves:
      document.onmousemove = elementDrag;
    }
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    if (elmnt.classList[0] == "block") {
      elmnt.style.top = (elmnt.offsetTop - pos2 - 5) + "px";
      elmnt.style.left = (elmnt.offsetLeft - pos1 - 5) + "px";
    }
    else {
      elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
      elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
    changeIsMade();
  }
}
function selectBlock(block) {
  selectedBlocks.push(block);
  block.classList.toggle("selectedBlock");
  if (selectedBlocks.length > 1) {
    moveBlock(selectedBlocks[0], selectedBlocks[1]);
  }
}
function moveBlock(block, newParent) {
  block.classList.remove("selectedBlock");
  newParent.classList.remove("selectedBlock");
  var node = block.cloneNode(true);
  if (newParent == document.getElementById("space")) {
    node.setAttribute("draggable", "");
    node.style.position = "absolute";
    dragElement(node);
  }
  else {
    node.setAttribute("draggable", null);
    node.style = "";
  }
  node.getElementsByClassName("selectButton")[0].onclick = function(){selectBlock(this.parentElement)};
  newParent.appendChild(node);
  block.remove();
  selectedBlocks = [];
  changeIsMade();
}
function moveBlockToSpace() {
  if (selectedBlocks.length > 0) {
    moveBlock(selectedBlocks[0], document.getElementById("space"));
  }
}
function disposeBlock() {
  selectedBlocks[0].classList.remove("selectedBlock");
  if (selectedBlocks.length > 0) {
    selectedBlocks[0].remove();
    changeIsMade();
  }
  selectedBlocks = [];
}
function runProgram() {
  gradients = [];
  while (intervals.length > 0) {
    clearInterval(intervals[0]);
    intervals.unshift();
  }
  for (var i = 0; i < document.querySelectorAll("div[name=start]").length; i++) {
    runSnippet(document.querySelectorAll("div[name=start]")[i]);
  }
}
function runSnippet(snippetBlock) {
  for (var i = 0; i < snippetBlock.childNodes.length; i++) {
    if (snippetBlock.childNodes[i].nodeName != "DIV" || snippetBlock.childNodes[i].className.indexOf("block") < 0)
      continue;
    let thisBlock = snippetBlock.childNodes[i];
    eval(snippetBlock.childNodes[i].getAttribute("code"));
    function valueOf(item) {
      return thisBlock.querySelector("input[name=" + item + "]").value;
    }
    function valueOfSelect(item) {
      return thisBlock.querySelector("select[name=" + item + "]").value;
    }
    function valueOfNum(item) {
      return parseFloat(valueOf(item));
    }
  }
}
function downloadCode() {
  if (saveFile(prompt("Download as", "Untitled"), ".cwb", document.getElementById("space").innerHTML))
    setSaved();
}
function uploadCode() {
  if (savedChange != changes[nowChange]) {
    if (!confirm(confirmMessage)) {
      return;
    }
  }
  readFile(".cwb", function(text) {document.getElementById("space").innerHTML = text;});
  setSaved();
}
function saveCode() {
  var projContent = document.getElementById("space").innerHTML;
  var projName = prompt("Save as (letters, underscores and numbers)", "Untitled");
  if (projName == undefined || projName == "") {
    alert("You didn't enter a value.");
    return;
  }
  if (projName == null) {
    return;
  }
  if (!isValidRegex(projName)) {
    alert("Please enter valid name next time.");
    return;
  }
  if (getCookie("projects").split(";").includes(projName)) {
    if (confirm("There's a project with the same name. Are you sure you want to replace it?")) {
      setCookie("proj+" + projName, projContent, 730);
      return;
    }
  }
  setCookie("proj+" + projName, projContent, 730);
  var projects = getCookie("projects").split(";");
  projects.push(projName);
  setCookie("projects", projects.join(";"), 730);
  setSaved();
}
function loadCode() {
  location.replace("../open-project");
}
function undoChanges() {
  if (nowChange < 1) return;
  nowChange--;
  document.getElementById("space").innerHTML = changes[nowChange];
}
function redoChanges() {
  if (nowChange + 1 >= changes.length) return;
  nowChange++;
  document.getElementById("space").innerHTML = changes[nowChange];
}
ctrlKeyPressEvent.on(90, undoChanges);
ctrlKeyPressEvent.on(89, redoChanges);