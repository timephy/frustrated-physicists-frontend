/** Returns whether the given string if "on" or "off". */
const stringIsBool = (str) => str == "on" || str == "off";

/** String corrections for input fields. */
const sanitizeInput = (input) => input.trim();

/** Adds hide class to element after specified time. */
function hideDelay(element, time) {
  setTimeout(() => element.classList.add("hide"), time);
}

/** Removes the element from its parent after specified time. */
function destroyDelay(element, time) {
  setTimeout(() => element.remove(), time);
}

/** Adds the class to element and then removes it after a delay. */
function addTemporaryClass(targetElem, cssClass, time) {
  if (!!resetableTimers[cssClass]) {
    clearTimeout(resetableTimers[cssClass])
  }
  targetElem.classList.add(cssClass);
  resetableTimers[cssClass] = setTimeout(() => targetElem.classList.remove(cssClass), time);
  console.log(cssClass + ": timer " + resetableTimers[cssClass])
}

function CreateUserTableFromJSON(jsonData, eid, caption) {
  ownuser = {
    name: storage.name || "Gast"
  }
  jsonData.push(ownuser);
  // console.log(jsonData);

  CreateTableFromJSON(jsonData, eid, caption);
}

function CreateTableFromJSON(jsonData, eid, caption) {
  var col = [];
  for (var i = 0; i < jsonData.length; i++)
    for (var key in jsonData[i])
      if (col.indexOf(key) === -1)
        col.push(key);

  // CREATE DYNAMIC TABLE.
  var table = document.createElement("table");

  //CREATE TABLE CAPTION
  var cap = table.createCaption();
  cap.textContent = caption;


  // CREATE HTML TABLE HEADER ROW USING THE EXTRACTED HEADERS ABOVE.
  var head = table.createTHead();
  var tr = head.insertRow(-1); // TABLE ROW.

  for (var i = 0; i < col.length; i++) {
    var th = document.createElement("th"); // TABLE HEADER.
    th.innerHTML = col[i];
    tr.appendChild(th);
  }

  // ADD JSON DATA TO THE TABLE AS ROWS.
  for (var i = 0; i < jsonData.length; i++) {
    tr = table.insertRow(-1);

    for (var j = 0; j < col.length; j++) {
      var tabCell = tr.insertCell(-1);
      tabCell.innerHTML = jsonData[i][col[j]];
    }
  }

  // FINALLY ADD THE NEWLY CREATED TABLE WITH JSON DATA TO A CONTAINER.
  const divContainer = document.getElementById(eid);
  divContainer.innerHTML = "";
  divContainer.appendChild(table);
}

function CreateTextFromJSON(jsonData, eid) {
  console.log(jsonData);

  const txt = document.createElement("h2");
  txt.textContent = JSON.stringify(jsonData, null, 4);
  const divContainer = document.getElementById(eid);
  divContainer.innerHTML = "";
  divContainer.appendChild(txt);
}

function loadJson(callback, path) {
  fetch(path)
    .then(response => response.json())
    .then(json => callback(null, json))
    .catch(error => callback(error, {
      error: "while fetching data, sorry"
    }));
}

function groupBy(array, kf) {
  const result = array.reduce(function(r, a) {
    key = kf(a)
    r[key] = r[key] || [];
    r[key].push(a);
    return r;
  }, Object.create(null));
  return result
}
