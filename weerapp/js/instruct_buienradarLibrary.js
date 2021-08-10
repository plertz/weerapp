/*
  Deze library is gemaakt door Uitgeverij Instruct ten behoeve van de lesmethode Fundament.
  Met deze library worden de gegevens die Buienradar via https://data.buienradar.nl/2.0/feed/json
  beschikbaar stelt op een eenvoudige manier benaderbaar.

  De weerdata die Buienradar beschikbaar stelt, is gratis, onder enkele voorwaarden.
  Die voorwaarden lees je op: https://www.buienradar.nl/overbuienradar/gratis-weerdata

  Zo mag je de data alleen gebruiken voor niet-commerciele doeleinden en is bronvermelding verplicht.
  Ook voor het gebruik van mobiele toepassingen is toestemming vereist.
*/

var xmlhttp = new XMLHttpRequest();
var buienradarData;
var nearestWeatherStation;
var msgNoData = "Data tijdelijk niet beschikbaar..";

var currentLat, currentLon;

// Laad de buienradar data
function loadBuienradarData() {
    // Als reponse binnenkomt
    xmlhttp.onreadystatechange = function() {
        if(this.readyState === 4 && this.status === 200) {
            buienradarData = JSON.parse(this.responseText);
        }
    };
    // Request versturen
    xmlhttp.open("GET", "https://api.buienradar.nl/data/public/2.0/jsonfeed", false);
    xmlhttp.send();
    //console.log(buienradarData);
}


// Vraag actuele locatie op aan browser/telefoon
function getLocation() {
    // Is er iets in local storage?
    if(localStorage.currentLatLS  &&  localStorage.currentLonLS) {
        // Direct door
        getNearestWeatherStation(null);
    } else {
        // Bestaat niet.
        if (navigator.geolocation) {
            // Locatie gevonden, bepaal dichstbijzijnde weerstation
            navigator.geolocation.getCurrentPosition(getNearestWeatherStation);
        } else {
            alert('Huidige locatie opvragen wordt niet ondersteunt!');
        }
    }
}

// Dichstbijzijnde weerstation bepalen
function getNearestWeatherStation(position) {
    // Is er een position meegegeven?
    if(position !== null) {
        // Opslaan in localstorage
        currentLat = position.coords.latitude;
        currentLon = position.coords.longitude;
        localStorage.currentLatLS = currentLat;
        localStorage.currentLonLS = currentLon;
    } else {
        // Geen positie meegegeven, ophalen uit local storage
        currentLat = localStorage.currentLatLS;
        currentLon = localStorage.currentLonLS;
    }
    //console.log(currentLat + ", " + currentLon);

    // All weerstations
    weerstations = buienradarData.actual.stationmeasurements;

    // Variabelen om mee te werken
    var dichtbij;
    var afstand = 1000;

    // Ieder weerstation aflopen
    for (var weerstation in weerstations) {
        if (weerstations.hasOwnProperty(weerstation)) {

            // Afstand bepalen ten opzichte van eigen locatie en locatie weerstation
            tempAfstand = getDistanceFromLatLonInKm(weerstations[weerstation].lat, weerstations[weerstation].lon, currentLat, currentLon);
            //console.log(weerstations[weerstation].stationname + ": " + tempAfstand + "km");

            // Is deze afstand korter dan een eerder gevonden weerstation?
            if(afstand > tempAfstand) {
                // Dan is dit nu de dichstbijzijnde
                afstand = tempAfstand;
                dichtbij = weerstations[weerstation];
            }
        }
    }

    nearestWeatherStation = dichtbij;

    showWeatherInfo();
}


// Functie om het weerstation by ID op te halen
function getWeatherStationById(stationid) {

    // Ieder weerstation aflopen
    for (var weerstation in weerstations) {
        if (weerstations.hasOwnProperty(weerstation)) {
            if(weerstations[weerstation].stationid === stationid) {
                return weerstations[weerstation];
            }
        }
    }
}



// Functie om afstand te bepalen a.d.v. GPS
function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1);
    var a =
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c; // Distance in km
    return d;
}

// Functie om graden naar radialen om te rekenen
function deg2rad(deg) {
    return deg * (Math.PI/180);
}


// Deel 2: alle functie om weerdata te tonen

// Predefined functions
function icoonNu() {
	var beschrijving = currentLocation_stationDescription();
	var zwaarBewolkt = beschrijving.includes("zwaar bewolkt");
	var ZwaarBewolkt = beschrijving.includes("Zwaar bewolkt");
	var lichtBewolkt = beschrijving.includes("licht bewolkt");
	var LichtBewolkt = beschrijving.includes("Licht bewolkt");
	var nat = beschrijving.includes("nat");
	var Nat = beschrijving.includes("Nat");
	var bui = beschrijving.includes("bui");
	var Bui = beschrijving.includes("Bui");
	var regen = beschrijving.includes("regen");
	var Regen = beschrijving.includes("Regen");


	if ((zwaarBewolkt == true || ZwaarBewolkt == true) && (regen == true || bui == true || nat == true)) {
		return "regen.png";
	} else if ((lichtBewolkt == true || LichtBewolkt == true) && (regen == true || Regen == true || bui == true || Bui == true || nat == true || Nat == true)) {
		return "regenwolk.png";
	} else if((zwaarBewolkt == true || ZwaarBewolkt == true) && regen == false && Regen == false && bui == false && Bui == false && nat == false && Nat == false) {
		return "wolk.png";
	} else if ((lichtBewolkt == true || LichtBewolkt == true) && regen == false && Regen == false && bui == false && Bui == false && nat == false && Nat == false) {
		return "zonwolk.png";
	} else {
		return "zon.png";
	}
}
function achtergrond() {
	var beschrijving = currentLocation_stationDescription();
	var zwaarBewolkt = beschrijving.includes("zwaar bewolkt");
	var ZwaarBewolkt = beschrijving.includes("Zwaar bewolkt");
	var lichtBewolkt = beschrijving.includes("licht bewolkt");
	var LichtBewolkt = beschrijving.includes("Licht bewolkt");
	var nat = beschrijving.includes("nat");
	var Nat = beschrijving.includes("Nat");
	var bui = beschrijving.includes("bui");
	var Bui = beschrijving.includes("Bui");
	var regen = beschrijving.includes("regen");
	var Regen = beschrijving.includes("Regen");


	if ((zwaarBewolkt == true || ZwaarBewolkt == true) && (regen == true || bui == true || nat == true)) {
		return "#005d61";
	} else if ((lichtBewolkt == true || LichtBewolkt == true) && (regen == true || Regen == true || bui == true || Bui == true || nat == true || Nat == true)) {
		return "#006b6f";
	} else if((zwaarBewolkt == true || ZwaarBewolkt == true) && regen == false && Regen == false && bui == false && Bui == false && nat == false && Nat == false) {
		return "#00787d";
	} else if ((lichtBewolkt == true || LichtBewolkt == true) && regen == false && Regen == false && bui == false && Bui == false && nat == false && Nat == false) {
		return "#00868b";
	} else {
		return "#329ea2";
	}
}

function currentLocation_temperature() {
	var letterO = "o";
	var supO = letterO.sup();
	var TemperatuurEenheid = localStorage.TemperatuurEenheid;
	// Anders wordt het Celsius
	if(TemperatuurEenheid === undefined) TemperatuurEenheid = "Celsius";

	var tempTemperatuur = nearestWeatherStation.temperature;

	if(TemperatuurEenheid == "Kelvin") {
		return tempTemperatuur + 273;
	} else if (TemperatuurEenheid == "Fahrenheit") {
		return Math.round(tempTemperatuur * 1.8 + 32) + supO;
	} else {
		return tempTemperatuur + supO;
	}
}
function currentLocation_stationName() {
    return nearestWeatherStation.stationname;
}
function currentLocation_stationRegio() {
    return nearestWeatherStation.regio;
}
function currentLocation_stationGraphUrl(id) {
    document.getElementById(id).innerHTML = nearestWeatherStation.graphurl;
}
function currentLocation_stationIconUrl(id) {
    document.getElementById(id).src = nearestWeatherStation.iconurl;
}
function currentLocation_stationDescription() {
    return nearestWeatherStation.weatherdescription;
}
function currentLocation_stationWindDirection() {
	return nearestWeatherStation.winddirection;
}
function currentLocation_stationAirPressure() {
    return nearestWeatherStation.airpressure;
}
function currentLocation_stationGroundTemperature() {
    return nearestWeatherStation.groundtemperature;
}
function currentLocation_stationFeelTemperature() {
    return nearestWeatherStation.feeltemperature;
}
function currentLocation_stationVisibility() {
    return nearestWeatherStation.visibility;
}
function currentLocation_stationWindSpeed() {
	var WindEenheid = localStorage.WindEenheid;

	if(WindEenheid === undefined) WindEenheid = "m/s";

	var windWind = nearestWeatherStation.windspeed;

	if(WindEenheid == "knopen") {
		return Math.round((windWind * 3.6)/1.852) + " kt";
	} else if (WindEenheid == "BFT") {
		return 	nearestWeatherStation.windspeedBft + " BFT";
	} else if (WindEenheid == "km/h") {
		return Math.round(windWind * 3.6) + " km/h";
	} else {
		return windWind + " m/s";
	}
}

function currentLocation_stationWindSpeedBft() {
    return nearestWeatherStation.windspeedBft;
}
function currentLocation_stationHumidity() {
    return nearestWeatherStation.humidity;
}
function currentLocation_stationSunPower() {
    return nearestWeatherStation.sunpower;
}
function currentLocation_stationRainFallLast24Hour(id) {
    document.getElementById(id).innerHTML = nearestWeatherStation.rainFallLast24Hour;
}
function currentLocation_stationRainFallLastHour() {
	return nearestWeatherStation.rainFallLastHour;
}
function currentLocation_stationWindDirectionDegree() {
    return nearestWeatherStation.winddirectiondegrees;
}



// Gegevens van een specifiek weerstation
function weatherstation_temperature(stationid, id) {
    var weerstationData = getWeatherStationById(stationid);
    document.getElementById(id).innerHTML = weerstationData.temperature;
}
function weatherstation_stationName(stationid, id) {
    var weerstationData = getWeatherStationById(stationid);
    document.getElementById(id).innerHTML = weerstationData.stationname;
}
function weatherstation_stationRegio(stationid, id) {
    var weerstationData = getWeatherStationById(stationid);
    document.getElementById(id).innerHTML = weerstationData.regio;
}
function weatherstation_stationGraphUrl(stationid, id) {
    var weerstationData = getWeatherStationById(stationid);
    document.getElementById(id).innerHTML = weerstationData.graphurl;
}
function weatherstation_stationIconUrl(stationid, id) {
    var weerstationData = getWeatherStationById(stationid);
    document.getElementById(id).src = weerstationData.iconurl;
}
function weatherstation_stationDescription(stationid, id) {
    var weerstationData = getWeatherStationById(stationid);
    document.getElementById(id).innerHTML = weerstationData.weatherdescription;
}
function weatherstation_stationWindDirection(stationid, id) {
    var weerstationData = getWeatherStationById(stationid);
    document.getElementById(id).innerHTML = weerstationData.winddirection;
}
function weatherstation_stationAirPressure(stationid, id) {
    var weerstationData = getWeatherStationById(stationid);
    document.getElementById(id).innerHTML = weerstationData.airpressure;
}
function weatherstation_stationGroundTemperature(stationid, id) {
    var weerstationData = getWeatherStationById(stationid);
    document.getElementById(id).innerHTML = weerstationData.groundtemperature;
}
function weatherstation_stationFeelTemperature(stationid, id) {
    var weerstationData = getWeatherStationById(stationid);
    document.getElementById(id).innerHTML = weerstationData.feeltemperature;
}
function weatherstation_stationVisibility(stationid, id) {
    var weerstationData = getWeatherStationById(stationid);
    document.getElementById(id).innerHTML = weerstationData.visibility;
}
function weatherstation_stationWindSpeed(stationid, id) {
    var weerstationData = getWeatherStationById(stationid);
    document.getElementById(id).innerHTML = weerstationData.windspeed;
}
function weatherstation_stationWindSpeedBft(stationid, id) {
    var weerstationData = getWeatherStationById(stationid);
    document.getElementById(id).innerHTML = weerstationData.windspeedBft;
}
function weatherstation_stationHumidity(stationid, id) {
    var weerstationData = getWeatherStationById(stationid);
    document.getElementById(id).innerHTML = weerstationData.humidity;
}
function weatherstation_stationSunPower(stationid, id) {
    var weerstationData = getWeatherStationById(stationid);
    document.getElementById(id).innerHTML = weerstationData.sunpower;
}
function weatherstation_stationRainFallLast24Hour(stationid, id) {
    var weerstationData = getWeatherStationById(stationid);
    document.getElementById(id).innerHTML = weerstationData.rainFallLast24Hour;
}
function weatherstation_stationRainFallLastHour(stationid, id) {
    var weerstationData = getWeatherStationById(stationid);
    document.getElementById(id).innerHTML = weerstationData.rainFallLastHour;
}
function weatherstation_stationWindDirectionDegree(stationid, id) {
    var weerstationData = getWeatherStationById(stationid);
    document.getElementById(id).innerHTML = weerstationData.winddirectiondegrees;
}



// Datum en tijd

// Alleen dagnaam
function date_showName(datum = new Date()) {
    // Is de parameter een datum? Zo nee, dan maken we die.
    if(Object.prototype.toString.call(datum) !== '[object Date]') {
        var nu = new Date(datum);
    } else {
        var nu = datum;
    }

    var dagen = ["zondag","maandag", "dinsdag","woensdag","donderdag","vrijdag","zaterdag"];

    return dagen[nu.getDay()];
}

//Alleen maandnaam
function date_showMonth(datum = new Date()) {
    // Is de parameter een datum? Zo nee, dan maken we die.
    if(Object.prototype.toString.call(datum) !== '[object Date]') {
        var nu = new Date(datum);
    } else {
        var nu = datum;
    }

    var dagen = ["januari","februari", "maart","april","mei","juni","juli", "augustus", "september", "oktober", "november", "december"];

    return dagen[nu.getMonth()];
}

// Volledige datum
function date_showDate(datum = new Date(), seperator = "-") {

    // Is de parameter een datum? Zo nee, dan maken we die.
    if(Object.prototype.toString.call(datum) !== '[object Date]') {
        var nu = new Date(datum);
    } else {
        var nu = datum;
    }

    var dag = nu.getDate();
    var dag2 = ((dag < 10) ? "0" : "") + dag;
    var maand = nu.getMonth() + 1;
    var maand2 = ((maand < 10) ? "0" : "") + maand;
    var jaar = nu.getYear();
    var jaar4 = ((jaar < 1900) ? (jaar + 1900) : (jaar));

    return dag2 + seperator + maand2 + seperator + jaar4;
}

//Alleen dag
function date_showDay(datum = new Date(), seperator = "-") {

    // Is de parameter een datum? Zo nee, dan maken we die.
    if(Object.prototype.toString.call(datum) !== '[object Date]') {
        var nu = new Date(datum);
    } else {
        var nu = datum;
    }

    var dag = nu.getDate();
    var dag2 = ((dag < 10) ? "0" : "") + dag;

    return dag2;
}

// Dag/maand
function date_showDayMonth(datum = new Date(), seperator = "-") {

    // Is de parameter een datum? Zo nee, dan maken we die.
    if(Object.prototype.toString.call(datum) !== '[object Date]') {
        var nu = new Date(datum);
    } else {
        var nu = datum;
    }

    var dag = nu.getDate();
    var dag2 = ((dag < 10) ? "0" : "") + dag;
    var maand = nu.getMonth() + 1;
    var maand2 = ((maand < 10) ? "0" : "") + maand;

    return dag2 + seperator + maand2;
}

// Tijd (uur minuut)
function time_showTime(id, datum = new Date(), seperator = ":") {

    // Is de parameter een datum? Zo nee, dan maken we die.
    if(Object.prototype.toString.call(datum) !== '[object Date]') {
        var nu = new Date(datum);
    } else {
        var nu = datum;
    }

    var uur = nu.getHours();
    var uur2 = ((uur < 10) ? "0" : "") + uur;
    var minuut = nu.getMinutes();
    var minuut2 = ((minuut < 10) ? "0" : "") + minuut;

    document.getElementById(id).innerHTML = uur2 + seperator + minuut2;
}


// Losse gegevens
function buienradar_map(id) {
    document.getElementById(id).src = buienradarData.actual.actualradarurl;
}

function buienradar_sunrise() {
    return buienradarData.actual.sunrise;
}

function buienradar_sunset() {
    return buienradarData.actual.sunset;
}


// Voorspellingen
function forecast_shorterm() {
	return buienradarData.forecast.shortterm.summary;
}
function forecast_longterm() {
  return buienradarData.forecast.longterm.summary;
}
function forecast_title() {
    return buienradarData.forecast.weatherreport.title;
}

function forecast_summary() {
    return buienradarData.forecast.weatherreport.summary;
}

function forecast_text() {
    return buienradarData.forecast.weatherreport.text;
}

function forecast_author(id) {
    document.getElementById(id).innerHTML = buienradarData.forecast.weatherreport.author;
}


// Functies voor de temperatuur eenheid
function temperatuurEenheid() {
	var letterO = "o";
	var supO = letterO.sup();
	var TemperatuurEenheid = localStorage.TemperatuurEenheid;
	// Anders wordt het Celsius
	if(TemperatuurEenheid === undefined) TemperatuurEenheid = "Celsius";

	if(TemperatuurEenheid == "Celsius") {
		return supO + "C";
	} else if (TemperatuurEenheid == "Kelvin") {
		return "K";
	} else {
		return supO + "F";
	}
}


// Meerdaagse verwachting
function icoon(dagen = 1) {
	if(buienradarData.forecast.fivedayforecast[dagen - 1].mmRainMax > 0 && buienradarData.forecast.fivedayforecast[dagen - 1].sunChance <= 20){
		return "regen.png";
	} else if(buienradarData.forecast.fivedayforecast[dagen - 1].mmRainMax > 0 && buienradarData.forecast.fivedayforecast[dagen - 1].sunChance > 20 && buienradarData.forecast.fivedayforecast[dagen - 1].sunChance < 70) {
		return "regenzon.png";
	} else if(buienradarData.forecast.fivedayforecast[dagen - 1].sunChance <= 20) {
		return "wolk.png";
	} else if (buienradarData.forecast.fivedayforecast[dagen - 1].sunChance < 70) {
		return "zonwolk.png";
	} else {
		return "zon.png";
	}
}


function validateDayNumber(dagnr) {
    if(dagnr < 1) {
        return 1;
    }
    if(dagnr > 5) {
        return 5;
    }
    return dagnr;
}

function forecast_date(dagen = 1) {
    dagen = validateDayNumber(dagen);
    if(buienradarData.forecast.fivedayforecast.length === 0) {
        return new Date();
    }
    return buienradarData.forecast.fivedayforecast[dagen - 1].day;
}

function forecast_minTemperature(dagen = 1) {
    dagen = validateDayNumber(dagen);
    if(buienradarData.forecast.fivedayforecast.length === 0) {
        return msgNoData;
    }
    var letterO = "o";
    var supO = letterO.sup();
	  var TemperatuurEenheid = localStorage.TemperatuurEenheid;
	  if(TemperatuurEenheid === undefined){ TemperatuurEenheid = "Celsius";}

    var tempTemperatuur = buienradarData.forecast.fivedayforecast[dagen - 1].mintemperatureMin;

    if(TemperatuurEenheid == "Kelvin") {
      return tempTemperatuur + 273;
    } else if (TemperatuurEenheid == "Fahrenheit") {
      return Math.round(tempTemperatuur * 1.8 + 32) + supO;
    } else {
      return tempTemperatuur + supO;
    }
}

function forecast_maxTemperature(dagen = 1) {
    dagen = validateDayNumber(dagen);
    if(buienradarData.forecast.fivedayforecast.length === 0) {
        return msgNoData;
    }

	var TemperatuurEenheid = localStorage.TemperatuurEenheid;
	// Anders wordt het Celsius
	if(TemperatuurEenheid === undefined) TemperatuurEenheid = "Celsius";

	var tempTemperatuur = buienradarData.forecast.fivedayforecast[dagen - 1].maxtemperatureMax;

	if(TemperatuurEenheid == "Kelvin") {
		return tempTemperatuur + 273;
	} else if (TemperatuurEenheid == "Fahrenheit") {
		return Math.round(tempTemperatuur * 1.8 + 32);
	} else {
		return tempTemperatuur;
	}
}

function forecast_rainChance(dagen = 1) {
    dagen = validateDayNumber(dagen);
    if(buienradarData.forecast.fivedayforecast.length === 0) {
        return msgNoData;
    }
    return buienradarData.forecast.fivedayforecast[dagen - 1].rainChance;
}

function forecast_sunChance(dagen = 1) {
    dagen = validateDayNumber(dagen);
    if(buienradarData.forecast.fivedayforecast.length === 0) {
        return msgNoData;
    }
    return buienradarData.forecast.fivedayforecast[dagen - 1].sunChance;
}

function forecast_windDirection(dagen = 1) {
    dagen = validateDayNumber(dagen);
    if(buienradarData.forecast.fivedayforecast.length === 0) {
        return msgNoData;
    }

	if(buienradarData.forecast.fivedayforecast[dagen - 1].windDirection=="n") {
			return 270;
		} else if (buienradarData.forecast.fivedayforecast[dagen - 1].windDirection=="no") {
			return 315;
		} else if (buienradarData.forecast.fivedayforecast[dagen - 1].windDirection=="0") {
			return 0;
		} else if (buienradarData.forecast.fivedayforecast[dagen - 1].windDirection=="zo") {
			return 45;
		} else if (buienradarData.forecast.fivedayforecast[dagen - 1].windDirection=="z") {
			return 90;
		} else if (buienradarData.forecast.fivedayforecast[dagen - 1].windDirection=="zw") {
			return 135;
		} else if (buienradarData.forecast.fivedayforecast[dagen - 1].windDirection=="w") {
			return 180;
		} else if (buienradarData.forecast.fivedayforecast[dagen - 1].windDirection=="nw") {
			return 225;
		}
}

function forecast_wind(dagen = 1) {
    dagen = validateDayNumber(dagen);
    if(buienradarData.forecast.fivedayforecast.length === 0) {
        return msgNoData;
    }

	var WindEenheid = localStorage.WindEenheid;

	if(WindEenheid === undefined) WindEenheid = "m/s";

	var BFT = buienradarData.forecast.fivedayforecast[dagen - 1].wind;
	var kmh = ["0", "3", "9", "15", "24", "34", "44", "55", "69", "81", "95", "110", "118"];


	if(WindEenheid == "knopen") {
		return Math.round(kmh[BFT] / 1.852) + " kt";
	} else if (WindEenheid == "BFT") {
		return 	BFT + " BFT";
	} else if (WindEenheid == "km/h") {
		return kmh[BFT] + " km/h";
	} else {
		return Math.round(kmh[BFT] / 3.6) + " m/s";
	}
}

function forecast_mmRainMin(dagen = 1) {
    dagen = validateDayNumber(dagen);
    if(buienradarData.forecast.fivedayforecast.length === 0) {
        return msgNoData;
    }

	var NeerslagEenheid = localStorage.NeerslagEenheid;

	if(NeerslagEenheid === undefined) NeerslagEenheid = "mm";

	var neerNeerslag = buienradarData.forecast.fivedayforecast[dagen - 1].mmRainMin;

	if(NeerslagEenheid == "inch") {
		return Math.round(neerNeerslag / 254);
	} else {
		return neerNeerslag;
	}
}

function forecast_mmRainMax(dagen = 1) {
    dagen = validateDayNumber(dagen);
    if(buienradarData.forecast.fivedayforecast.length === 0) {
        return msgNoData;
    }

	var NeerslagEenheid = localStorage.NeerslagEenheid;

	if(NeerslagEenheid === undefined) NeerslagEenheid = "mm";

	var neerNeerslag = buienradarData.forecast.fivedayforecast[dagen - 1].mmRainMax;

	if(NeerslagEenheid == "inch") {
		return Math.round(neerNeerslag * 0,0393700787) + " in";
	} else {
		return neerNeerslag + " mm";
	}
}

function forecast_iconurl(dagen = 1) {
    dagen = validateDayNumber(dagen);
    if(buienradarData.forecast.fivedayforecast.length === 0) {
        return msgNoData;
    }
    return buienradarData.forecast.fivedayforecast[dagen - 1].iconurl;
}

function forecast_weatherdescription(dagen = 1) {
    dagen = validateDayNumber(dagen);
    if(buienradarData.forecast.fivedayforecast.length === 0) {
		return msgNoData;
    }
    return buienradarData.forecast.fivedayforecast[dagen - 1].weatherdescription;
}
