/*jshint esversion: 6 */

const button = document.getElementById("mainButton");
const anker = document.getElementById("toastAnker");
const wrapper = document.getElementById("wrapper");
const panker = document.getElementById("popupAnker");
const nameInput = document.getElementById("nameInput");
const commentInput = document.getElementById("commentInput");
const today = document.getElementById("today");
const online = document.getElementById("online");
const session = document.getElementById("session");
const total = document.getElementById("total");

/** The possible label alternatives for the main button. */
const possibleButtonLabels = [
  "Exmatrikulation",
  "GOP",
  "noch Fragen?",
  "fresh Hermann",
  "E1GeNv3kToR",
  "I wanna die",
  "end me now",
  "Gib auf",
  "（┬＿┬）",
  "(◕︵◕)",
  "RIP Studium",
  "Zeile mal Spalte",
  "?????"
];

/** The message displayed by "help" command. */
const HELP_MESSAGE = [
  "Syntax:  /{command}",
  "Click colors:",
  "    " + ["green", "purple", "blue", "yellow", "black", "white", "fancy"].join(", "),
  "Click lines:",
  "    " + ["small", "big", "dotted", "dashed", "highlight", "fire"].join(", "),
  "Events:",
  "    " + ["zudummfürtum", "lemma 6.7", "sas", "einstein", "belasto", "fireworks", "satan", "666", "pride", "rainbow", "fu"].join(", "),
  "Options:",
  "    " + ["vibrate", "darkmode", "clear"].join(", "),
  "Dev options:",
  "    " + ["buffer", "fps", "test", "log"].join(", ")
].join("\n")

/** effect variables */
const resetableTimers = {};
const RESET_TIME = 4000;
const activeToasts = {}

const tfrag = document.createDocumentFragment();

/** A helper class to manage and update current stats. */
class StatsDisplay {
  // total
  get total() {
    return this._total || 0;
  }
  set total(value) {
    this._total = value;
    total.textContent = this.total;

    if (value !== 0) {
      if (value % 100000 == 0) {
        popup("+100.000")
      } else if (value % 10000 == 0) {
        popup("+10.000")
      }
    }
  }

  // day
  get day() {
    return this._today || 0;
  }
  set day(value) {
    this._today = value;
  }

  // session
  get session() {
    return this._session || 0;
  }
  set session(value) {
    this._session = value;
  }

  // online
  get online() {
    return this._online || 0;
  }
  set online(value) {
    this._online = value;
  }
}

const statsDisplay = new StatsDisplay()

// Utils

/** Display a popup. */
function popup(text, cssClass = "popup") {
  const pop = document.createElement("div")
  pop.className = cssClass;
  pop.appendChild(document.createTextNode(text));
  panker.appendChild(pop);
  destroyDelay(pop, 5000);
}

/** Einstein effect. */
function einstein() {
  const einstein = document.createElement("span")
  einstein.className = "einstein";
  anime.set(einstein, {
    top: anime.random(-10, 90) + '%',
    left: anime.random(-10, 90) + '%',
  });

  panker.appendChild(einstein);
  destroyDelay(einstein, 5000);
}

function belasto() {
  const belasto = document.createElement("span")
  belasto.className = "belasto"
  anime.set(belasto, {
    top: anime.random(-10, 90) + '%',
    left: anime.random(-10, 90) + '%',
  });

  anime({
    targets: belasto,
    rotate: anime.random(-30, 30) + 'deg',
    scale: [0.4, 1]
  })
  destroyDelay(belasto, 30000);

  wrapper.appendChild(belasto);
}

function formula(type) {
  const formula = document.createElement("span")
  formula.className = "formula " + type;
  anime.set(formula, {
    top: anime.random(-10, 90) + '%',
    left: anime.random(-10, 90) + '%',
  });

  anime({
    targets: formula,
    rotate: anime.random(-30, 30) + 'deg',
    scale: [0.4, 1]
  })
  destroyDelay(formula, 20000);

  wrapper.appendChild(formula);
}

/** Returns a randomized button label. */
function displayRandomButtonLabel() {
  button.textContent = Math.random() < 0.9 ?
    "ich verzweifle" :
    possibleButtonLabels[Math.floor(Math.random() * possibleButtonLabels.length)];
}

/** Toggle comment field. */
function openComment(commentButton) {
  if (commentInput.classList.contains("hide")) {
    commentInput.classList.remove("hide")
    commentInput.parentElement.classList.remove("hide")
    anime({
      targets: '#commentExpandPath',
      d: [{
          value: "m 0,25 L 50,75 L 100,25"
        },
        {
          value: "m 0,75 L 50,25 L 100,75"
        }
      ],
      duration: 250,
      easing: 'easeInOutSine'
    });
  } else {
    commentInput.classList.add("hide")
    commentInput.parentElement.classList.add("hide")
    anime({
      targets: '#commentExpandPath',
      d: [{
          value: "m 0,75 L 50,25 L 100,75"
        },
        {
          value: "m 0,25 L 50,75 L 100,25"
        }
      ],
      duration: 250,
      easing: 'easeInOutSine'
    });
  }
}

/** Displays the buttom click animation. */
const ringBase = document.createElement("div");
ringBase.className = "ring";

function displayRing() {
  const ring = ringBase.cloneNode(true);
  button.parentElement.appendChild(ring);
  destroyDelay(ring, 700)
}

/** Displays a click (Killfeed-like-style). */
function displayClick(click) {
  let text = `${click.name} verzweifelt...`
  // add comment in braces if present
  if (click.comment != undefined && click.comment != "") {
    text = text.concat(` (${click.comment})`);
  }
  displayToast(text, click.style);
}

function displayToast(string, effectClass, unstackable = false) {
  if (activeToasts[string + "\n" + effectClass] !== undefined && !unstackable) {
    atoast = activeToasts[string + "\n" + effectClass];
    clearTimeout(atoast[2])
    //create a new timer instance
    atoast[2] = setTimeout(atoast[3], RESET_TIME)
    if (atoast[4] == 1)
      anime.set(atoast[1], {
        display: 'block'
      });
    atoast[4]++;
    atoast[1].textContent = atoast[4];

    if (!anker.contains(atoast[0]))
      tfrag.prepend(atoast[0]);

    //set counter position
    if (anime.get(atoast[1], 'width', 'rem') != atoast[5]) {
      atoast[5] = anime.get(atoast[1], 'width', 'rem');

      //set the width of our message counter
      anime.set(atoast[1], {
        right: (-atoast[5] - 1.2) + 'rem'
      });

      //ease the width of our toast message
      anime({
        targets: atoast[0],
        'margin-right': (atoast[5] + 1.2) + 'rem',
        duration: 250,
        easing: 'easeInOutSine'
      });
    }

    anime.timeline({
      targets: atoast[1]
    }).add({
      scale: [0.5, 1],
      translateY: (anime.random(-100, 100) / 200) + 'rem',
      translateX: (anime.random(-100, 100) / 200) + 'rem',
      opacity: 1,
      duration: 100,
      easing: 'easeOutSine',
    }).add({
      translateY: 0,
      translateX: 0,
      opacity: 1,
      duration: 100,
      easing: 'easeOutSine',
      endDelay: RESET_TIME - 1200,
    }).add({
      easing: 'easeInSine',
      scale: 0.2,
      opacity: 0,
      duration: 1000
    });
  } else {
    newToast(string, effectClass);
  }
}

var toastBase = document.createElement("div");
var clickCounter = document.createElement("div");

function newToast(string, effectClass) {
  // prevent extreme amounts of comment messages
  if (anker.childElementCount > MAX_TOASTS)
    anker.lastElementChild.remove();

  var toast = toastBase.cloneNode(true);
  var count = clickCounter.cloneNode(true);
  //function that hides, animates and deletes the toast when executed
  function funkyFunc() {
    toast.classList.add("hide");
    delete activeToasts[string + "\n" + effectClass];
    var animation = anime({
      targets: toast,
      delay: 500,
      duration: 250,
      padding: 0,
      'margin-top': 0,
      'margin-bottom': 0,
      'max-height': 0,
      opacity: 0,
      easing: 'easeInSine'
    });
    // toast.remove has to be evaluated while in DOM, otherwise undefined?
    animation.finished.then(() => toast.remove());
  }

  // save the toast with his resetable timer and removal function (key is the string + cssClasses)
  /* elements in an active toast:
  0 ref to the toast element, 1 ref to the counter element of this toast, 2 removal timeout id,
  3 removal function,         4 the click count of this toast,            5 the width of the toast
  */
  activeToasts[string + "\n" + effectClass] = [toast, count, setTimeout(funkyFunc, RESET_TIME), funkyFunc, 1, 0];

  toast.className = [effectClass, "toast"].join(" ");
  count.className = [effectClass, "clickCounter"].join(" ");
  toast.textContent = string;
  toast.appendChild(count)
  tfrag.prepend(toast);
  /* currently using the css animation from before
  anime({
    targets: toast,
    maxheight: [0,'4em'],
    duration: 500,
    opacity: 1,
    translateY: ['100%',0]
  })*/
}


//code for the fps counter
const times = [];
let fps;

function refreshLoop() {
  window.requestAnimationFrame(() => {
    const now = performance.now();
    while (times.length > 0 && times[0] <= now - 1000) {
      times.shift();
    }
    times.push(now);
    fps = times.length;

    anker.prepend(tfrag);

    today.textContent = statsDisplay.day;
    session.textContent = statsDisplay.session;
    online.textContent = statsDisplay.online;
    refreshLoop();
  });
}
refreshLoop();

function updateFps() {
  document.getElementById("fps").textContent = fps;
}
