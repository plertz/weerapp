
//enkele variabelen van html elementen
var body = document.getElementsByTagName("body")[0];
var nav = document.getElementsByTagName("nav")[0];
var content = document.getElementsByClassName("content")[0];
var width = window.innerWidth;
var height = window.innerHeight;
var kaartTab = document.getElementsByClassName("kaartTab")[0];
var advies = document.getElementsByClassName("advies")[0];
var weekoverzicht = document.getElementsByClassName("weekoverzicht")[0];

//update functie
function update() {
  requestAnimationFrame(update);

height = window.innerHeight;
width = window.innerWidth;

//center weerbericht
if (content) {
  content.style.top = (height - nav.offsetHeight) / 2 + nav.offsetHeight + "px";
}

//center kaart
if (kaartTab) {
  kaartTab.style.top = (height - nav.offsetHeight) / 2 + nav.offsetHeight + "px";
}

//center advies
if (advies) {
  advies.style.top = (height - nav.offsetHeight) / 2 + nav.offsetHeight + "px";
}

//center Weekoverzicht
if (weekoverzicht) {
  weekoverzicht.style.top = (height - nav.offsetHeight) / 2 + nav.offsetHeight + "px";
}
}

update();

//instellingen menu
var setMenu = document.getElementsByClassName("menu")[0];

function openSettings() {
  setMenu.style.width = "100%";
}

function closeSettings() {
  setMenu.style.width = "0";
  location.reload();
}

//open info menu
var infoMenu = document.getElementsByClassName("info")[0];
function openInfo() {
  infoMenu.style.display = "block";
}

function closeInfo() {
  infoMenu.style.display = "none";
}

//wijzigen eenehid Instellingen

//Temperatuur
function temperatuurVeranderen() {
  let TemperatuurEenheid = document.getElementsByClassName("tempSet")[0].innerHTML;
  let tempSet = document.getElementsByClassName("tempSet")[0];

  if(TemperatuurEenheid == "Kelvin") {
    tempSet.innerHTML = "Celsius";
  }
  else if(TemperatuurEenheid == "Celsius") {
    tempSet.innerHTML = "Fahrenheit";
  }
  else if(TemperatuurEenheid == "Fahrenheit") {
    tempSet.innerHTML = "Kelvin";
  }
  localStorage.setItem("TemperatuurEenheid", tempSet.innerHTML);
}

function temperatuurVeranderenTeurg() {
  let TemperatuurEenheid = document.getElementsByClassName("tempSet")[0].innerHTML;
  let tempSet = document.getElementsByClassName("tempSet")[0];

  if(TemperatuurEenheid == "Kelvin") {
    tempSet.innerHTML = "Fahrenheit";
  }
  else if(TemperatuurEenheid == "Celsius") {
    tempSet.innerHTML = "Kelvin";
  }
  else if(TemperatuurEenheid == "Fahrenheit") {
    tempSet.innerHTML = "Celsius";
  }
  localStorage.setItem("TemperatuurEenheid", tempSet.innerHTML);
}

//Wind
function changeWindEenheid() {
  let WindEenheid = document.getElementsByClassName("windSet")[0].innerHTML;
  let windSet = document.getElementsByClassName("windSet")[0];

  if(WindEenheid == "km/h") {
    windSet.innerHTML = "BFT";
  }
  else if(WindEenheid == "BFT") {
    windSet.innerHTML = "m/s";
  }
  else if(WindEenheid == "m/s") {
    windSet.innerHTML = "knopen";
  }
  else if (WindEenheid == "knopen") {
    windSet.innerHTML = "km/h";
  }

  localStorage.setItem("WindEenheid", windSet.innerHTML);
}

function changeWindEenheidTerug() {
  let WindEenheid = document.getElementsByClassName("windSet")[0].innerHTML;
  let windSet = document.getElementsByClassName("windSet")[0];

  if(WindEenheid == "km/h") {
    windSet.innerHTML = "knopen";
  }
  else if(WindEenheid == "BFT") {
    windSet.innerHTML = "km/h";
  }
  else if(WindEenheid == "m/s") {
    windSet.innerHTML = "BFT";
  }
  else if (WindEenheid == "knopen") {
    windSet.innerHTML = "m/s";
  }

  localStorage.setItem("WindEenheid", windSet.innerHTML);
}

//Neerslag
function changeNeerslagEenheid() {
  let NeerslagEenheid = document.getElementsByClassName("neerSet")[0].innerHTML;
  let neerSet = document.getElementsByClassName("neerSet")[0];

  if(NeerslagEenheid == "mm") {
    neerSet.innerHTML = "inch";
  }
  else if(NeerslagEenheid == "inch") {
    neerSet.innerHTML = "mm";
  }

  localStorage.setItem("NeerslagEenheid", neerSet.innerHTML);
}

//fix eeneheden
function fixWindEenheid() {
  let WindEenheid = localStorage.WindEenheid;
  if(WindEenheid === undefined) WindEenheid = "km/h";
  let windSet = document.getElementsByClassName("windSet")[0];
  windSet.innerHTML = WindEenheid;
}

function fixTemperatuurEenheid() {
  let TemperatuurEenheid = localStorage.TemperatuurEenheid;
  if(TemperatuurEenheid === undefined) TemperatuurEenheid = "Celsius";
  let tempSet = document.getElementsByClassName("tempSet")[0];
  tempSet.innerHTML = TemperatuurEenheid;
}

function fixNeerslagEenheid() {
  let NeerslagEenheid = localStorage.NeerslagEenheid;
  if(NeerslagEenheid === undefined) NeerslagEenheid = "mm";
  let neerSet = document.getElementsByClassName("neerSet")[0];
  neerSet.innerHTML = NeerslagEenheid;
}

//open de kaart tabs
var kaartTab1 = document.getElementsByClassName("KaartTab1")[0];
var kaartTab2 = document.getElementsByClassName("KaartTab2")[0];
var regenKaartBut = document.getElementsByClassName("regenKaartBut")[0];
var tempKaartBut = document.getElementsByClassName("tempKaartBut")[0];
function tab2() {
  kaartTab1.style.display = "none";
  kaartTab2.style.display = "block";
  regenKaartBut.classList.remove("passiefTab");
  tempKaartBut.classList.add("passiefTab");
}

function tab1() {
  kaartTab2.style.display = "none";
  kaartTab1.style.display = "block";
  tempKaartBut.classList.remove("passiefTab");
  regenKaartBut.classList.add("passiefTab");
}

//fullscreen regenkaart
var fullScreenRegenKaart = document.getElementsByClassName("fullScreenRegenKaart")[0];
function fullScreenRegenKaartCls() {
  fullScreenRegenKaart.style.display = "none"
}
