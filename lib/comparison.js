/*
    All of the logic that does the process of finding the best weather of a list of cities on a selected day.

    The main outline functions are at the top, and the smaller worker functions are at the bottom.

    It has a main starter function which then takes one of two routes.  If the user has radius:true, the zipcode functions will be run to find random weather within a set radius.  If it is radius:false, then the list of favorite cities on the user will be used.
*/


require('dotenv').load(); // for APIKEY
var request = require('request'); // for server-side HTTP requests
var weatherUrl = "http://api.wunderground.com/api/"+ process.env.WUAPIKEY + "/features/geolookup/forecast10day/q/__zipcode__.json";
var citiesArr=[];
var response;


//**************************************************
//*********** Dummy Data -- For Testing ************
// To run test uncomment this data and the functions
// call at the end of this document.
// $ node lib/comparison
//**************************************************
// var req = {};
// req.user = {
//   username: "sfrieson",
//   password: "{type: String}",
//   token: "{type: String}",
//   name: {first: "Steven", last: "Frieson"},
//   lastname: "Frieson",
//   radius: "true",
//   cities: {
//     main: {
//         name: "New York",
//         zipcode: "10001"
//     },
//     favorites: [
//         {name: "Garnet Valley",
//         zipcode: "19060"},
//         {name: "Whitinsville",
//         zipcode: "01588"}
//     ]
//   }
// };
// var res = {};
// res.json = function(err, input){
//     console.log(JSON.stringify(input, null, 4));
// };
//**************************************************
//**************************************************

function performLogic(req, res) {
    citiesArr = [];//clear out from previous requests

    // Start!
    console.log("Fire it up!");

    response = function(err, resObj){
        console.log("Response...");
        // Send back the result of our findings
        if(err){
            return res.status(err.code).json({error: err.description});
        }
        res.json(resObj); //res saved in closure
    };

    (req.user.radius === "true") ? zipApiRequest(req) : loadCityData(req);
}


// USER'S ZIPCODE RADIUS VERSION ============================
// function loadZipcodes (req) { //CHANGE from dbCity to randomTen for Radius search -Ana
//     //Loop for all of the needed data requests on the req.user
//     console.log("Getting each city's data...");
//     var randomTenArr = zipApiRequest();
//     console.log(randomTenArr);
// }

function zipApiRequest(req) {
    var zipUrl = 'https://www.zipcodeapi.com/rest/' + process.env.ZIPAPIKEY +'/radius.json/'+ req.user.cities.main.zipcode +'/150/mile';
  //console.log(zipUrl);
  var zipCodes;
  request(zipUrl, function (err, response, body) {
    zipCodes = JSON.parse(body).zip_codes;
    var shuffle = shuffleZipCodes(zipCodes);
    var tenZips = randomTen(shuffle);
    return cityLoop(tenZips);
    // console.log(cityLoop(tenZips));
  });

}

//shuffle data array
function shuffleZipCodes(arr) {
  var i = arr.length, tempValue, randomIndex;
  while (i !== 0) {
    randomIndex = Math.floor(Math.random() * i);
	  i--;
		tempValue = arr[i];
		arr[i] = arr[randomIndex];
		arr[randomIndex] = tempValue;
	}
  return arr;
}

//create new array with 10 zipcodes from randomized data array
function randomTen(arr) {
  var randomTenArr = [];
  for (var i = 0; i < 5; i++) {
    randomTenArr.push(arr[i]);
  }
  // console.log(randomTenArr);
  return randomTenArr;
  }

//for each city in the user's city list
function cityLoop(randomTenArr) {
  var i = 0;
  var requesting = setInterval(function () {
    var zipcode = randomTenArr[i].zip_code;
    sendRequest(zipcode, i, randomTenArr.length);
    i++;
   if (i == randomTenArr.length) {
     clearInterval(requesting);
   }
  }, 500);
    }


// USER'S FAVORITE LIST VERSION ==============================
function loadCityData (req) {
    //Loop for all of the needed data requests on the req.user
    console.log("Getting each city's data...");
    var dbCities = req.user.cities.favorites; //Current users favorite cities array
    console.log(dbCities);
    if (!dbCities.length) {
        console.log("Returning error.");
        return response( {code: 404, description: "No favorite cities."} ); } //No favorites on user

    //for each city in the user's city list
    var i = 0;
    var requesting = setInterval(function () {
        var zipcode = dbCities[i].zipcode;
        sendRequest(zipcode, i, dbCities.length);
        i++;
        if (i == dbCities.length) {
            clearInterval(requesting);
        }
    }, 500); //Throttling the request to safely be under 3/second
    //Once you have the data stored in citiesArr go call the scoreLogic function
    //do we need to wait for last response?  I think so...how...
    // return scoreLogic();  moved to last request
}








function sendRequest (zipcode, i, length) {
    var requestUrl = weatherUrl.replace(/__zipcode__/, zipcode); //Change out url zipcode placeholder
    console.log("Sending request to", requestUrl);
    request(requestUrl, function(err, response, body){
        citiesArr.push(JSON.parse(body));
        if (i == length - 1){ //If this is the last response, call the next function
            scoreLogic();
        }
    });
}


function scoreLogic (){
    //With all the city information in an array find all of their scores
    console.log("Scoring each city...");
    //go through each of the pieces of the data on each city, value them all, and assign them to a score key on the object
    for (var i = 0; i < citiesArr.length; i++) {
        var chosenDay = 0; // Choosing TODAY from the 10day forecast. Option for choice later.
        var city = citiesArr[i]; //Full city object
        var attr = city.forecast.simpleforecast.forecastday[chosenDay]; //City's forecast for the chosen day
        city.score = 0; //initialize

        temperature(city, attr);
        percipChance(city, attr);
        percipAmount(city, attr);
        conditions(city, attr);
        wind(city, attr);
    }

    //Send results off for sorting
    return comparison();
}


function comparison () {
    console.log("Sorting by their score...");

    //sort the cities by that key.
    citiesArr.sort(function(a, b){
        return b.score - a.score;
    });

    console.log({cities: citiesArr});
    return response(null, {cities: citiesArr}); //Last function. When done call the response.
}





// Helper functions ---------------------------------------------------
function temperature (city, attr){ //ex. 92
    return city.score += parseInt(attr.high.fahrenheit);
}

function percipChance (city, attr){ //ex. 90
    var points =  (1 - attr.pop/100) * 20 - 10; //range -10 to 10
    return city.score += points;
}

function percipAmount (city, attr){ //ex. .17
    var points = (attr.qpf_day.in * 10) + (attr.snow_day.in * 10); //Add daytime rain and snow accumulation
    return city.score -= points; //subtract from score
}

function conditions (city, attr){ //ex. "partiallysunny"
    var condition = attr.icon;
    var points=0;

    //Base condition points
    if ( /sunny$|clear$/.test(condition) ){points += 10;}
    if ( /cloudy$/.test(condition) ){points += -5;}
    if ( /flurries$|fog$|hazy$/.test(condition) ){points += -10;}
    if ( /snow$/.test(condition) ){points += -15;}
    if ( /rain$/.test(condition) ){points += -20;}
    if ( /tstorms$/.test(condition) ){points += -25;}
    if ( /sleet$/.test(condition) ){points += -30;}

    //Modified condition points
    if ( /^mostly/.test(condition) ){points *= 0.8;}
    if ( /^partially/.test(condition) ){points *= 0.6;}
    if ( /^chance/.test(condition) ){points *= 0.7;}

    return city.score += points;
}

function wind (city, attr){ //ex. 3
    var points = attr.avewind.mph;
    return city.score -= points;
}


module.exports = performLogic;
// performLogic(req, res);
