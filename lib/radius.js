require('dotenv').load();
var request = require('request');
var User = require('../models/user');
// var performLogic = require('performLogic');

var zip = 10001;
var zipUrl = 'https://www.zipcodeapi.com/rest/' + process.env.ZIPAPIKEY +'/radius.json/'+ zip +'/150/mile';

////////////////////////////////////////////////////////////////////////////////

var wUrl = "http://api.wunderground.com/api/"+ process.env.WUAPIKEY + "/features/geolookup/forecast10day/q/__zipcode__.json";

var citiesArr=[];
var response;

//////////////////////////////////////////////////
//** GET 10 RANDOM LOCATIONS FROM ZIPCODE API **//
//////////////////////////////////////////////////
function zipApiRequest() {
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



////////////////////////////////////////////////////////////////////////////////

function performLogic(req, res) {
    // Fire it up!
    console.log("Fire it up!");

    response = function(err, resObj){
        console.log("Response...");
        // Send back the result of our findings
        if(err){
            return res.status(err.code).json({error: err.description});
        }
        res.json(err, resObj); //res saved in closure
    };

    loadCityData(req);
}


  //Once you have the data stored in citiesArr go call the scoreLogic function
  //do we need to wait for last response?  I think so...how...
  // return scoreLogic();  moved to last request






function sendRequest (zipcode, i, length) {
    var requestUrl = wUrl.replace(/__zipcode__/, zipcode); //Change out url zipcode placeholder
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
        // REMOVE -Ana var chosenDay = parseInt(Math.random()*10); // ***** Number of days between today and desired travel day [min:0, max:9] **********CHANGE WITH REAL DATA
        var city = citiesArr[i]; //Full city object
        var attr = city.forecast.simpleforecast.forecastday[0]; //CHANGE TO 0 FOR RADIUS -Ana
        city.score = 0; //initialize

        temperature(city, attr);
        percipChance(city, attr);
        percipAmount(city, attr);
        conditions(city, attr);
        wind(city, attr);
    }

    //Send results it off for sorting
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


////////////////////////////////////////////////////////////////////////////////

performLogic();
