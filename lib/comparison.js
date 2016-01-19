/*
    All of the logic that does the process of finding the best weather of a list of cities on a selected day.

    The main outline functions are at the top, and the smaller worker functions are at the bottom.
*/
require('dotenv').load(); // for APIKEY
var request = require('request'); // for server-side HTTP requests
var url = "http://api.wunderground.com/api/"+ process.env.WUAPIKEY + "/features/geolookup/forecast10day/q/__zipcode__.json";
var citiesArr=[];
var response;


//**************************************************
//************ Dummy Data -- DELETE ****************
//**************************************************
// var req = {};
// req.user = {
//   username: "sfrieson",
//   password: "{type: String}",
//   token: "{type: String}",
//   name: {first: "Steven", last: "Frieson"},
//   lastname: "Frieson",
//   cities: {
//     main: "New York",
//     favorites: [
//         {name: "Garnet Valley",
//         zipcode: 19060},
//         {name: "Whitinsville",
//         zipcode: "01588"}
//     ]
//   }
// };
// var res = {};
// res.json = function(input){
//     console.log(JSON.stringify(input, null, 4));
// };
//**************************************************

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
    var requestUrl = url.replace(/__zipcode__/, zipcode); //Change out url zipcode placeholder
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
        var chosenDay = parseInt(Math.random()*10); // ***** Number of days between today and desired travel day [min:0, max:9] **********CHANGE WITH REAL DATA
        var city = citiesArr[i]; //Full city object
        var attr = city.forecast.simpleforecast.forecastday[chosenDay]; //City's forecast for the chosen day
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


module.exports = performLogic;


// Dummy Data--------------------------------------------------------------
var fakeCities=[];
fakeCities[0] = {
    response: {
        version: "0.1",
        termsofService: "http://www.wunderground.com/weather/api/d/terms.html",
        features: {
            forecast10day: 1
        }
    },
    forecast: {
        txt_forecast: {
            date: "4:50 AM PST",
            forecastday: [
                {
                    period: 0,
                    icon: "rain",
                    icon_url: "http://icons.wxug.com/i/c/k/rain.gif",
                    title: "Saturday",
                    fcttext: "Rain early...then remaining cloudy with showers in the afternoon. Thunder possible. High 58F. Winds S at 10 to 15 mph. Chance of rain 70%.",
                    fcttext_metric: "Rain early...then remaining cloudy with showers in the afternoon. Thunder possible. High around 15C. Winds S at 10 to 15 km/h. Chance of rain 70%.",
                    pop: "70"
                },
                {
                    period: 1,
                    icon: "nt_cloudy",
                    icon_url: "http://icons.wxug.com/i/c/k/nt_cloudy.gif",
                    title: "Saturday Night",
                    fcttext: "Overcast. Low 53F. Winds SSE at 5 to 10 mph.",
                    fcttext_metric: "Cloudy. Low 12C. Winds SSE at 10 to 15 km/h.",
                    pop: "20"
                },
                {
                    period: 2,
                    icon: "rain",
                    icon_url: "http://icons.wxug.com/i/c/k/rain.gif",
                    title: "Sunday",
                    fcttext: "Rain showers in the morning will evolve into a more steady rain in the afternoon. High 59F. Winds S at 10 to 20 mph. Chance of rain 100%. Rainfall around a half an inch.",
                    fcttext_metric: "Rain showers in the morning will evolve into a more steady rain in the afternoon. High near 15C. Winds S at 15 to 30 km/h. Chance of rain 100%. Rainfall around 6mm.",
                    pop: "100"
                },
                {
                    period: 3,
                    icon: "nt_rain",
                    icon_url: "http://icons.wxug.com/i/c/k/nt_rain.gif",
                    title: "Sunday Night",
                    fcttext: "Rain early...then remaining cloudy with showers late. Low 53F. Winds SSW at 10 to 20 mph. Chance of rain 100%. Rainfall possibly over one inch.",
                    fcttext_metric: "Rain early...then remaining cloudy with showers late. Low 12C. Winds S at 15 to 25 km/h. Chance of rain 100%. Rainfall near 12mm.",
                    pop: "100"
                },
                {
                    period: 4,
                    icon: "partlycloudy",
                    icon_url: "http://icons.wxug.com/i/c/k/partlycloudy.gif",
                    title: "Monday",
                    fcttext: "Sunshine and clouds mixed. High 58F. Winds light and variable.",
                    fcttext_metric: "Intervals of clouds and sunshine. High near 15C. Winds light and variable.",
                    pop: "20"
                },
                {
                    period: 5,
                    icon: "nt_mostlycloudy",
                    icon_url: "http://icons.wxug.com/i/c/k/nt_mostlycloudy.gif",
                    title: "Monday Night",
                    fcttext: "Partly cloudy during the evening followed by cloudy skies overnight. Low near 50F. Winds light and variable.",
                    fcttext_metric: "Partly cloudy skies early will become overcast later during the night. Low around 10C. Winds light and variable.",
                    pop: "20"
                },
                {
                    period: 6,
                    icon: "rain",
                    icon_url: "http://icons.wxug.com/i/c/k/rain.gif",
                    title: "Tuesday",
                    fcttext: "Periods of rain. High 57F. Winds S at 5 to 10 mph. Chance of rain 90%. Rainfall near a quarter of an inch.",
                    fcttext_metric: "Cloudy with periods of rain. High 14C. Winds S at 10 to 15 km/h. Chance of rain 90%. Rainfall around 6mm.",
                    pop: "90"
                },
                {
                    period: 7,
                    icon: "nt_chancerain",
                    icon_url: "http://icons.wxug.com/i/c/k/nt_chancerain.gif",
                    title: "Tuesday Night",
                    fcttext: "Considerable cloudiness with occasional rain showers. Low 52F. Winds S at 5 to 10 mph. Chance of rain 40%.",
                    fcttext_metric: "Cloudy with showers. Low 11C. Winds S at 10 to 15 km/h. Chance of rain 50%.",
                    pop: "40"
                },
                {
                    period: 8,
                    icon: "partlycloudy",
                    icon_url: "http://icons.wxug.com/i/c/k/partlycloudy.gif",
                    title: "Wednesday",
                    fcttext: "Cloudy early with partial sunshine expected late. High near 60F. Winds SE at 5 to 10 mph.",
                    fcttext_metric: "Cloudy skies early, followed by partial clearing. High 17C. Winds light and variable.",
                    pop: "10"
                },
                {
                    period: 9,
                    icon: "nt_partlycloudy",
                    icon_url: "http://icons.wxug.com/i/c/k/nt_partlycloudy.gif",
                    title: "Wednesday Night",
                    fcttext: "Partly cloudy. Low 52F. Winds light and variable.",
                    fcttext_metric: "A few clouds from time to time. Low 11C. Winds light and variable.",
                    pop: "10"
                },
                {
                    period: 10,
                    icon: "partlycloudy",
                    icon_url: "http://icons.wxug.com/i/c/k/partlycloudy.gif",
                    title: "Thursday",
                    fcttext: "Cloudy skies early will become partly cloudy later in the day. High near 60F. Winds SSW at 5 to 10 mph.",
                    fcttext_metric: "Cloudy skies early, followed by partial clearing. High 16C. Winds SSW at 10 to 15 km/h.",
                    pop: "20"
                },
                {
                    period: 11,
                    icon: "nt_chancerain",
                    icon_url: "http://icons.wxug.com/i/c/k/nt_chancerain.gif",
                    title: "Thursday Night",
                    fcttext: "Considerable cloudiness with occasional rain showers. Low around 55F. Winds S at 5 to 10 mph. Chance of rain 60%.",
                    fcttext_metric: "Cloudy with occasional showers. Low 13C. Winds S at 10 to 15 km/h. Chance of rain 60%.",
                    pop: "60"
                },
                {
                    period: 12,
                    icon: "chancerain",
                    icon_url: "http://icons.wxug.com/i/c/k/chancerain.gif",
                    title: "Friday",
                    fcttext: "Overcast with rain showers at times. High 59F. Winds S at 10 to 15 mph. Chance of rain 60%.",
                    fcttext_metric: "Cloudy with showers. High around 15C. Winds S at 15 to 25 km/h. Chance of rain 60%.",
                    pop: "60"
                },
                {
                    period: 13,
                    icon: "nt_chancerain",
                    icon_url: "http://icons.wxug.com/i/c/k/nt_chancerain.gif",
                    title: "Friday Night",
                    fcttext: "Showers in the evening with some clearing overnight. Low 51F. Winds SSW at 5 to 10 mph. Chance of rain 40%.",
                    fcttext_metric: "Rain showers early with mostly cloudy conditions late. Low 11C. Winds SSW at 10 to 15 km/h. Chance of rain 40%.",
                    pop: "40"
                },
                {
                    period: 14,
                    icon: "chancerain",
                    icon_url: "http://icons.wxug.com/i/c/k/chancerain.gif",
                    title: "Saturday",
                    fcttext: "Cloudy with showers. High 56F. Winds SW at 10 to 15 mph. Chance of rain 60%.",
                    fcttext_metric: "Cloudy with showers. High 14C. Winds SW at 10 to 15 km/h. Chance of rain 60%.",
                    pop: "60"
                },
                {
                    period: 15,
                    icon: "nt_chancerain",
                    icon_url: "http://icons.wxug.com/i/c/k/nt_chancerain.gif",
                    title: "Saturday Night",
                    fcttext: "Cloudy with occasional rain showers. Low 49F. Winds SSW at 5 to 10 mph. Chance of rain 60%.",
                    fcttext_metric: "Overcast with rain showers at times. Low 9C. Winds SSW at 10 to 15 km/h. Chance of rain 60%.",
                    pop: "60"
                },
                {
                    period: 16,
                    icon: "chancerain",
                    icon_url: "http://icons.wxug.com/i/c/k/chancerain.gif",
                    title: "Sunday",
                    fcttext: "Rain showers early with some sunshine later in the day. High 56F. Winds ENE at 5 to 10 mph. Chance of rain 50%.",
                    fcttext_metric: "Rain showers early with some sunshine later in the day. High 14C. Winds NNE at 10 to 15 km/h. Chance of rain 50%.",
                    pop: "50"
                },
                {
                    period: 17,
                    icon: "nt_chancerain",
                    icon_url: "http://icons.wxug.com/i/c/k/nt_chancerain.gif",
                    title: "Sunday Night",
                    fcttext: "Partly cloudy skies early will give way to occasional showers later during the night. Low 51F. Winds light and variable. Chance of rain 50%.",
                    fcttext_metric: "Partly cloudy skies early will give way to occasional showers later during the night. Low 11C. Winds light and variable. Chance of rain 50%.",
                    pop: "50"
                },
                {
                    period: 18,
                    icon: "chancerain",
                    icon_url: "http://icons.wxug.com/i/c/k/chancerain.gif",
                    title: "Monday",
                    fcttext: "Cloudy with occasional rain showers. High 58F. Winds light and variable. Chance of rain 50%.",
                    fcttext_metric: "Considerable cloudiness with occasional rain showers. High 14C. Winds light and variable. Chance of rain 50%.",
                    pop: "50"
                },
                {
                    period: 19,
                    icon: "nt_chancerain",
                    icon_url: "http://icons.wxug.com/i/c/k/nt_chancerain.gif",
                    title: "Monday Night",
                    fcttext: "Showers in the evening, then cloudy overnight. Low 52F. Winds light and variable. Chance of rain 30%.",
                    fcttext_metric: "A few showers early with overcast skies late. Low 11C. Winds light and variable. Chance of rain 30%.",
                    pop: "30"
                }
            ]
        },
        simpleforecast: {
            forecastday: [
                {
                    date: {
                        epoch: "1452999600",
                        pretty: "7:00 PM PST on January 16, 2016",
                        day: 16,
                        month: 1,
                        year: 2016,
                        yday: 15,
                        hour: 19,
                        min: "00",
                        sec: 0,
                        isdst: "0",
                        monthname: "January",
                        monthname_short: "Jan",
                        weekday_short: "Sat",
                        weekday: "Saturday",
                        ampm: "PM",
                        tz_short: "PST",
                        tz_long: "America/Los_Angeles"
                    },
                    period: 1,
                    high: {
                        fahrenheit: "58",
                        celsius: "14"
                    },
                    low: {
                        fahrenheit: "53",
                        celsius: "12"
                    },
                    conditions: "Rain",
                    icon: "rain",
                    icon_url: "http://icons.wxug.com/i/c/k/rain.gif",
                    skyicon: "",
                    pop: 70,
                    qpf_allday: {
                        in: 0.13,
                        mm: 3
                    },
                    qpf_day: {
                        in: 0.13,
                        mm: 3
                    },
                    qpf_night: {
                        in: 0,
                        mm: 0
                    },
                    snow_allday: {
                        in: 0,
                        cm: 0
                    },
                    snow_day: {
                        in: 0,
                        cm: 0
                    },
                    snow_night: {
                        in: 0,
                        cm: 0
                    },
                    maxwind: {
                        mph: 15,
                        kph: 24,
                        dir: "S",
                        degrees: 177
                    },
                    avewind: {
                        mph: 10,
                        kph: 16,
                        dir: "S",
                        degrees: 177
                    },
                    avehumidity: 87,
                    maxhumidity: 0,
                    minhumidity: 0
                },
                {
                    date: {
                        epoch: "1453086000",
                        pretty: "7:00 PM PST on January 17, 2016",
                        day: 17,
                        month: 1,
                        year: 2016,
                        yday: 16,
                        hour: 19,
                        min: "00",
                        sec: 0,
                        isdst: "0",
                        monthname: "January",
                        monthname_short: "Jan",
                        weekday_short: "Sun",
                        weekday: "Sunday",
                        ampm: "PM",
                        tz_short: "PST",
                        tz_long: "America/Los_Angeles"
                    },
                    period: 2,
                    high: {
                        fahrenheit: "59",
                        celsius: "15"
                    },
                    low: {
                        fahrenheit: "53",
                        celsius: "12"
                    },
                    conditions: "Rain",
                    icon: "rain",
                    icon_url: "http://icons.wxug.com/i/c/k/rain.gif",
                    skyicon: "",
                    pop: 100,
                    qpf_allday: {
                        in: 1.14,
                        mm: 29
                    },
                    qpf_day: {
                        in: 0.39,
                        mm: 10
                    },
                    qpf_night: {
                        in: 0.75,
                        mm: 19
                    },
                    snow_allday: {
                        in: 0,
                        cm: 0
                    },
                    snow_day: {
                        in: 0,
                        cm: 0
                    },
                    snow_night: {
                        in: 0,
                        cm: 0
                    },
                    maxwind: {
                        mph: 20,
                        kph: 32,
                        dir: "S",
                        degrees: 175
                    },
                    avewind: {
                        mph: 14,
                        kph: 23,
                        dir: "S",
                        degrees: 175
                    },
                    avehumidity: 85,
                    maxhumidity: 0,
                    minhumidity: 0
                },
                {
                    date: {
                        epoch: "1453172400",
                        pretty: "7:00 PM PST on January 18, 2016",
                        day: 18,
                        month: 1,
                        year: 2016,
                        yday: 17,
                        hour: 19,
                        min: "00",
                        sec: 0,
                        isdst: "0",
                        monthname: "January",
                        monthname_short: "Jan",
                        weekday_short: "Mon",
                        weekday: "Monday",
                        ampm: "PM",
                        tz_short: "PST",
                        tz_long: "America/Los_Angeles"
                    },
                    period: 3,
                    high: {
                        fahrenheit: "58",
                        celsius: "14"
                    },
                    low: {
                        fahrenheit: "50",
                        celsius: "10"
                    },
                    conditions: "Partly Cloudy",
                    icon: "partlycloudy",
                    icon_url: "http://icons.wxug.com/i/c/k/partlycloudy.gif",
                    skyicon: "",
                    pop: 20,
                    qpf_allday: {
                        in: 0,
                        mm: 0
                    },
                    qpf_day: {
                        in: 0,
                        mm: 0
                    },
                    qpf_night: {
                        in: 0,
                        mm: 0
                    },
                    snow_allday: {
                        in: 0,
                        cm: 0
                    },
                    snow_day: {
                        in: 0,
                        cm: 0
                    },
                    snow_night: {
                        in: 0,
                        cm: 0
                    },
                    maxwind: {
                        mph: 10,
                        kph: 16,
                        dir: "SW",
                        degrees: 228
                    },
                    avewind: {
                        mph: 5,
                        kph: 8,
                        dir: "SW",
                        degrees: 228
                    },
                    avehumidity: 81,
                    maxhumidity: 0,
                    minhumidity: 0
                },
                {
                    date: {
                        epoch: "1453258800",
                        pretty: "7:00 PM PST on January 19, 2016",
                        day: 19,
                        month: 1,
                        year: 2016,
                        yday: 18,
                        hour: 19,
                        min: "00",
                        sec: 0,
                        isdst: "0",
                        monthname: "January",
                        monthname_short: "Jan",
                        weekday_short: "Tue",
                        weekday: "Tuesday",
                        ampm: "PM",
                        tz_short: "PST",
                        tz_long: "America/Los_Angeles"
                    },
                    period: 4,
                    high: {
                        fahrenheit: "57",
                        celsius: "14"
                    },
                    low: {
                        fahrenheit: "52",
                        celsius: "11"
                    },
                    conditions: "Rain",
                    icon: "rain",
                    icon_url: "http://icons.wxug.com/i/c/k/rain.gif",
                    skyicon: "",
                    pop: 90,
                    qpf_allday: {
                        in: 0.36,
                        mm: 9
                    },
                    qpf_day: {
                        in: 0.3,
                        mm: 8
                    },
                    qpf_night: {
                        in: 0.05,
                        mm: 1
                    },
                    snow_allday: {
                        in: 0,
                        cm: 0
                    },
                    snow_day: {
                        in: 0,
                        cm: 0
                    },
                    snow_night: {
                        in: 0,
                        cm: 0
                    },
                    maxwind: {
                        mph: 10,
                        kph: 16,
                        dir: "S",
                        degrees: 174
                    },
                    avewind: {
                        mph: 9,
                        kph: 14,
                        dir: "S",
                        degrees: 174
                    },
                    avehumidity: 80,
                    maxhumidity: 0,
                    minhumidity: 0
                },
                {
                    date: {
                        epoch: "1453345200",
                        pretty: "7:00 PM PST on January 20, 2016",
                        day: 20,
                        month: 1,
                        year: 2016,
                        yday: 19,
                        hour: 19,
                        min: "00",
                        sec: 0,
                        isdst: "0",
                        monthname: "January",
                        monthname_short: "Jan",
                        weekday_short: "Wed",
                        weekday: "Wednesday",
                        ampm: "PM",
                        tz_short: "PST",
                        tz_long: "America/Los_Angeles"
                    },
                    period: 5,
                    high: {
                        fahrenheit: "60",
                        celsius: "16"
                    },
                    low: {
                        fahrenheit: "52",
                        celsius: "11"
                    },
                    conditions: "Partly Cloudy",
                    icon: "partlycloudy",
                    icon_url: "http://icons.wxug.com/i/c/k/partlycloudy.gif",
                    skyicon: "",
                    pop: 10,
                    qpf_allday: {
                        in: 0,
                        mm: 0
                    },
                    qpf_day: {
                        in: 0,
                        mm: 0
                    },
                    qpf_night: {
                        in: 0,
                        mm: 0
                    },
                    snow_allday: {
                        in: 0,
                        cm: 0
                    },
                    snow_day: {
                        in: 0,
                        cm: 0
                    },
                    snow_night: {
                        in: 0,
                        cm: 0
                    },
                    maxwind: {
                        mph: 10,
                        kph: 16,
                        dir: "SE",
                        degrees: 130
                    },
                    avewind: {
                        mph: 6,
                        kph: 10,
                        dir: "SE",
                        degrees: 130
                    },
                    avehumidity: 76,
                    maxhumidity: 0,
                    minhumidity: 0
                },
                {
                    date: {
                        epoch: "1453431600",
                        pretty: "7:00 PM PST on January 21, 2016",
                        day: 21,
                        month: 1,
                        year: 2016,
                        yday: 20,
                        hour: 19,
                        min: "00",
                        sec: 0,
                        isdst: "0",
                        monthname: "January",
                        monthname_short: "Jan",
                        weekday_short: "Thu",
                        weekday: "Thursday",
                        ampm: "PM",
                        tz_short: "PST",
                        tz_long: "America/Los_Angeles"
                    },
                    period: 6,
                    high: {
                        fahrenheit: "60",
                        celsius: "16"
                    },
                    low: {
                        fahrenheit: "55",
                        celsius: "13"
                    },
                    conditions: "Partly Cloudy",
                    icon: "partlycloudy",
                    icon_url: "http://icons.wxug.com/i/c/k/partlycloudy.gif",
                    skyicon: "",
                    pop: 20,
                    qpf_allday: {
                        in: 0.11,
                        mm: 3
                    },
                    qpf_day: {
                        in: 0,
                        mm: 0
                    },
                    qpf_night: {
                        in: 0.11,
                        mm: 3
                    },
                    snow_allday: {
                        in: 0,
                        cm: 0
                    },
                    snow_day: {
                        in: 0,
                        cm: 0
                    },
                    snow_night: {
                        in: 0,
                        cm: 0
                    },
                    maxwind: {
                        mph: 10,
                        kph: 16,
                        dir: "SSW",
                        degrees: 199
                    },
                    avewind: {
                        mph: 6,
                        kph: 10,
                        dir: "SSW",
                        degrees: 199
                    },
                    avehumidity: 76,
                    maxhumidity: 0,
                    minhumidity: 0
                },
                {
                    date: {
                        epoch: "1453518000",
                        pretty: "7:00 PM PST on January 22, 2016",
                        day: 22,
                        month: 1,
                        year: 2016,
                        yday: 21,
                        hour: 19,
                        min: "00",
                        sec: 0,
                        isdst: "0",
                        monthname: "January",
                        monthname_short: "Jan",
                        weekday_short: "Fri",
                        weekday: "Friday",
                        ampm: "PM",
                        tz_short: "PST",
                        tz_long: "America/Los_Angeles"
                    },
                    period: 7,
                    high: {
                        fahrenheit: "59",
                        celsius: "15"
                    },
                    low: {
                        fahrenheit: "51",
                        celsius: "11"
                    },
                    conditions: "Chance of Rain",
                    icon: "chancerain",
                    icon_url: "http://icons.wxug.com/i/c/k/chancerain.gif",
                    skyicon: "",
                    pop: 60,
                    qpf_allday: {
                        in: 0.44,
                        mm: 11
                    },
                    qpf_day: {
                        in: 0.37,
                        mm: 9
                    },
                    qpf_night: {
                        in: 0.06,
                        mm: 2
                    },
                    snow_allday: {
                        in: 0,
                        cm: 0
                    },
                    snow_day: {
                        in: 0,
                        cm: 0
                    },
                    snow_night: {
                        in: 0,
                        cm: 0
                    },
                    maxwind: {
                        mph: 15,
                        kph: 24,
                        dir: "S",
                        degrees: 179
                    },
                    avewind: {
                        mph: 12,
                        kph: 19,
                        dir: "S",
                        degrees: 179
                    },
                    avehumidity: 75,
                    maxhumidity: 0,
                    minhumidity: 0
                },
                {
                    date: {
                        epoch: "1453604400",
                        pretty: "7:00 PM PST on January 23, 2016",
                        day: 23,
                        month: 1,
                        year: 2016,
                        yday: 22,
                        hour: 19,
                        min: "00",
                        sec: 0,
                        isdst: "0",
                        monthname: "January",
                        monthname_short: "Jan",
                        weekday_short: "Sat",
                        weekday: "Saturday",
                        ampm: "PM",
                        tz_short: "PST",
                        tz_long: "America/Los_Angeles"
                    },
                    period: 8,
                    high: {
                        fahrenheit: "56",
                        celsius: "13"
                    },
                    low: {
                        fahrenheit: "49",
                        celsius: "9"
                    },
                    conditions: "Chance of Rain",
                    icon: "chancerain",
                    icon_url: "http://icons.wxug.com/i/c/k/chancerain.gif",
                    skyicon: "",
                    pop: 60,
                    qpf_allday: {
                        in: 0.32,
                        mm: 8
                    },
                    qpf_day: {
                        in: 0.1,
                        mm: 3
                    },
                    qpf_night: {
                        in: 0.22,
                        mm: 6
                    },
                    snow_allday: {
                        in: 0,
                        cm: 0
                    },
                    snow_day: {
                        in: 0,
                        cm: 0
                    },
                    snow_night: {
                        in: 0,
                        cm: 0
                    },
                    maxwind: {
                        mph: 15,
                        kph: 24,
                        dir: "SW",
                        degrees: 226
                    },
                    avewind: {
                        mph: 10,
                        kph: 16,
                        dir: "SW",
                        degrees: 226
                    },
                    avehumidity: 75,
                    maxhumidity: 0,
                    minhumidity: 0
                },
                {
                    date: {
                        epoch: "1453690800",
                        pretty: "7:00 PM PST on January 24, 2016",
                        day: 24,
                        month: 1,
                        year: 2016,
                        yday: 23,
                        hour: 19,
                        min: "00",
                        sec: 0,
                        isdst: "0",
                        monthname: "January",
                        monthname_short: "Jan",
                        weekday_short: "Sun",
                        weekday: "Sunday",
                        ampm: "PM",
                        tz_short: "PST",
                        tz_long: "America/Los_Angeles"
                    },
                    period: 9,
                    high: {
                        fahrenheit: "56",
                        celsius: "13"
                    },
                    low: {
                        fahrenheit: "51",
                        celsius: "11"
                    },
                    conditions: "Chance of Rain",
                    icon: "chancerain",
                    icon_url: "http://icons.wxug.com/i/c/k/chancerain.gif",
                    skyicon: "",
                    pop: 50,
                    qpf_allday: {
                        in: 0.05,
                        mm: 1
                    },
                    qpf_day: {
                        in: 0.03,
                        mm: 1
                    },
                    qpf_night: {
                        in: 0.02,
                        mm: 1
                    },
                    snow_allday: {
                        in: 0,
                        cm: 0
                    },
                    snow_day: {
                        in: 0,
                        cm: 0
                    },
                    snow_night: {
                        in: 0,
                        cm: 0
                    },
                    maxwind: {
                        mph: 10,
                        kph: 16,
                        dir: "ENE",
                        degrees: 73
                    },
                    avewind: {
                        mph: 6,
                        kph: 10,
                        dir: "ENE",
                        degrees: 73
                    },
                    avehumidity: 77,
                    maxhumidity: 0,
                    minhumidity: 0
                },
                {
                    date: {
                        epoch: "1453777200",
                        pretty: "7:00 PM PST on January 25, 2016",
                        day: 25,
                        month: 1,
                        year: 2016,
                        yday: 24,
                        hour: 19,
                        min: "00",
                        sec: 0,
                        isdst: "0",
                        monthname: "January",
                        monthname_short: "Jan",
                        weekday_short: "Mon",
                        weekday: "Monday",
                        ampm: "PM",
                        tz_short: "PST",
                        tz_long: "America/Los_Angeles"
                    },
                    period: 10,
                    high: {
                        fahrenheit: "58",
                        celsius: "14"
                    },
                    low: {
                        fahrenheit: "52",
                        celsius: "11"
                    },
                    conditions: "Chance of Rain",
                    icon: "chancerain",
                    icon_url: "http://icons.wxug.com/i/c/k/chancerain.gif",
                    skyicon: "",
                    pop: 50,
                    qpf_allday: {
                        in: 0.07,
                        mm: 2
                    },
                    qpf_day: {
                        in: 0.06,
                        mm: 2
                    },
                    qpf_night: {
                        in: 0.01,
                        mm: 0
                    },
                    snow_allday: {
                        in: 0,
                        cm: 0
                    },
                    snow_day: {
                        in: 0,
                        cm: 0
                    },
                    snow_night: {
                        in: 0,
                        cm: 0
                    },
                    maxwind: {
                        mph: 5,
                        kph: 8,
                        dir: "ESE",
                        degrees: 113
                    },
                    avewind: {
                        mph: 4,
                        kph: 6,
                        dir: "ESE",
                        degrees: 113
                    },
                    avehumidity: 72,
                    maxhumidity: 0,
                    minhumidity: 0
                }
            ]
        }
    }
};

fakeCities[1] = {
    response: {
        version: "0.1",
        termsofService: "http://www.wunderground.com/weather/api/d/terms.html",
        features: {
            forecast10day: 1
        }
    },
    forecast: {
        txt_forecast: {
            date: "7:50 AM EST",
            forecastday: [
                {
                    period: 0,
                    icon: "chancerain",
                    icon_url: "http://icons.wxug.com/i/c/k/chancerain.gif",
                    title: "Saturday",
                    fcttext: "Cloudy with light rain this morning...then becoming partly cloudy. High 49F. Winds WNW at 10 to 15 mph. Chance of rain 40%.",
                    fcttext_metric: "Light rain early. A mix of sun and clouds by afternoon. High 9C. Winds WNW at 15 to 25 km/h. Chance of rain 40%.",
                    pop: "40"
                },
                {
                    period: 1,
                    icon: "nt_partlycloudy",
                    icon_url: "http://icons.wxug.com/i/c/k/nt_partlycloudy.gif",
                    title: "Saturday Night",
                    fcttext: "Cloudy skies early, then partly cloudy after midnight. Low 31F. Winds WNW at 5 to 10 mph.",
                    fcttext_metric: "Cloudy early with some clearing expected late. Low near 0C. Winds WNW at 10 to 15 km/h.",
                    pop: "0"
                },
                {
                    period: 2,
                    icon: "cloudy",
                    icon_url: "http://icons.wxug.com/i/c/k/cloudy.gif",
                    title: "Sunday",
                    fcttext: "Cloudy. High 36F. Winds light and variable.",
                    fcttext_metric: "Cloudy. High 2C. Winds light and variable.",
                    pop: "0"
                },
                {
                    period: 3,
                    icon: "nt_partlycloudy",
                    icon_url: "http://icons.wxug.com/i/c/k/nt_partlycloudy.gif",
                    title: "Sunday Night",
                    fcttext: "Partly cloudy. Low 26F. Winds W at 10 to 15 mph.",
                    fcttext_metric: "Partly cloudy. Low -3C. Winds W at 15 to 25 km/h.",
                    pop: "10"
                },
                {
                    period: 4,
                    icon: "mostlycloudy",
                    icon_url: "http://icons.wxug.com/i/c/k/mostlycloudy.gif",
                    title: "Monday",
                    fcttext: "Partly cloudy skies in the morning will give way to cloudy skies during the afternoon. A few flurries are possible. High 31F. Winds WNW at 15 to 25 mph.",
                    fcttext_metric: "Partly cloudy skies during the morning hours will become overcast in the afternoon. A few flurries are possible. High -1C. Winds WNW at 25 to 40 km/h.",
                    pop: "20"
                },
                {
                    period: 5,
                    icon: "nt_partlycloudy",
                    icon_url: "http://icons.wxug.com/i/c/k/nt_partlycloudy.gif",
                    title: "Monday Night",
                    fcttext: "A few clouds. Low 18F. Winds WNW at 10 to 20 mph.",
                    fcttext_metric: "Partly cloudy. Low -8C. Winds WNW at 15 to 30 km/h.",
                    pop: "0"
                },
                {
                    period: 6,
                    icon: "partlycloudy",
                    icon_url: "http://icons.wxug.com/i/c/k/partlycloudy.gif",
                    title: "Tuesday",
                    fcttext: "Partly cloudy. High 32F. Winds WNW at 15 to 25 mph.",
                    fcttext_metric: "Partly cloudy skies. High near 0C. Winds WNW at 25 to 40 km/h.",
                    pop: "0"
                },
                {
                    period: 7,
                    icon: "nt_partlycloudy",
                    icon_url: "http://icons.wxug.com/i/c/k/nt_partlycloudy.gif",
                    title: "Tuesday Night",
                    fcttext: "A few clouds. Low around 25F. Winds NW at 10 to 20 mph.",
                    fcttext_metric: "A few clouds. Low -4C. Winds NW at 15 to 30 km/h.",
                    pop: "0"
                },
                {
                    period: 8,
                    icon: "clear",
                    icon_url: "http://icons.wxug.com/i/c/k/clear.gif",
                    title: "Wednesday",
                    fcttext: "Sunny, along with a few afternoon clouds. High 38F. Winds NW at 10 to 15 mph.",
                    fcttext_metric: "Generally sunny despite a few afternoon clouds. High 3C. Winds NW at 10 to 15 km/h.",
                    pop: "0"
                },
                {
                    period: 9,
                    icon: "nt_partlycloudy",
                    icon_url: "http://icons.wxug.com/i/c/k/nt_partlycloudy.gif",
                    title: "Wednesday Night",
                    fcttext: "A few clouds from time to time. Low 26F. Winds NW at 5 to 10 mph.",
                    fcttext_metric: "Partly cloudy. Low -3C. Winds NW at 10 to 15 km/h.",
                    pop: "0"
                },
                {
                    period: 10,
                    icon: "clear",
                    icon_url: "http://icons.wxug.com/i/c/k/clear.gif",
                    title: "Thursday",
                    fcttext: "Mostly sunny. High near 40F. Winds NW at 5 to 10 mph.",
                    fcttext_metric: "Mainly sunny. High 4C. Winds NW at 10 to 15 km/h.",
                    pop: "0"
                },
                {
                    period: 11,
                    icon: "nt_clear",
                    icon_url: "http://icons.wxug.com/i/c/k/nt_clear.gif",
                    title: "Thursday Night",
                    fcttext: "Mostly clear. Low around 25F. Winds NW at 5 to 10 mph.",
                    fcttext_metric: "A mostly clear sky. Low -4C. Winds NW at 10 to 15 km/h.",
                    pop: "0"
                },
                {
                    period: 12,
                    icon: "partlycloudy",
                    icon_url: "http://icons.wxug.com/i/c/k/partlycloudy.gif",
                    title: "Friday",
                    fcttext: "Sunshine and clouds mixed. High 39F. Winds NNW at 5 to 10 mph.",
                    fcttext_metric: "Partly cloudy. High 4C. Winds NNW at 10 to 15 km/h.",
                    pop: "10"
                },
                {
                    period: 13,
                    icon: "nt_chancesnow",
                    icon_url: "http://icons.wxug.com/i/c/k/nt_chancesnow.gif",
                    title: "Friday Night",
                    fcttext: "Mostly clear skies early giving way to clouds and a few snow showers after midnight. Low 26F. Winds NNE at 5 to 10 mph. Chance of snow 30%.",
                    fcttext_metric: "Mostly clear during the evening. A few snow showers developing later during the night. Low -3C. Winds NNE at 10 to 15 km/h. Chance of snow 30%.",
                    pop: "30"
                },
                {
                    period: 14,
                    icon: "partlycloudy",
                    icon_url: "http://icons.wxug.com/i/c/k/partlycloudy.gif",
                    title: "Saturday",
                    fcttext: "Intervals of clouds and sunshine. High 38F. Winds NNE at 5 to 10 mph.",
                    fcttext_metric: "Partly cloudy skies. High 3C. Winds NNE at 10 to 15 km/h.",
                    pop: "20"
                },
                {
                    period: 15,
                    icon: "nt_clear",
                    icon_url: "http://icons.wxug.com/i/c/k/nt_clear.gif",
                    title: "Saturday Night",
                    fcttext: "Mostly clear skies. Low 26F. Winds NNW at 5 to 10 mph.",
                    fcttext_metric: "Mostly clear skies. Low -3C. Winds NNW at 10 to 15 km/h.",
                    pop: "10"
                },
                {
                    period: 16,
                    icon: "clear",
                    icon_url: "http://icons.wxug.com/i/c/k/clear.gif",
                    title: "Sunday",
                    fcttext: "Generally sunny despite a few afternoon clouds. High 43F. Winds NW at 5 to 10 mph.",
                    fcttext_metric: "Mostly sunny skies. High 6C. Winds NW at 10 to 15 km/h.",
                    pop: "20"
                },
                {
                    period: 17,
                    icon: "nt_partlycloudy",
                    icon_url: "http://icons.wxug.com/i/c/k/nt_partlycloudy.gif",
                    title: "Sunday Night",
                    fcttext: "A few clouds. Low 32F. Winds W at 5 to 10 mph.",
                    fcttext_metric: "A few clouds from time to time. Low around 0C. Winds W at 10 to 15 km/h.",
                    pop: "10"
                },
                {
                    period: 18,
                    icon: "clear",
                    icon_url: "http://icons.wxug.com/i/c/k/clear.gif",
                    title: "Monday",
                    fcttext: "Except for a few afternoon clouds, mainly sunny. High near 45F. Winds SW at 5 to 10 mph.",
                    fcttext_metric: "Except for a few afternoon clouds, mainly sunny. High 7C. Winds SW at 10 to 15 km/h.",
                    pop: "10"
                },
                {
                    period: 19,
                    icon: "nt_snow",
                    icon_url: "http://icons.wxug.com/i/c/k/nt_snow.gif",
                    title: "Monday Night",
                    fcttext: "Partly cloudy in the evening then becoming cloudy with a mix of rain and snow after midnight. Low 34F. Winds W at 5 to 10 mph. Chance of precip 40%.",
                    fcttext_metric: "Partly cloudy skies early will give way to cloudy skies with a mixture of rain and snow developing overnight. Low 1C. Winds W at 10 to 15 km/h. Chance of precip 40%.",
                    pop: "40"
                }
            ]
        },
        simpleforecast: {
            forecastday: [
                {
                    date: {
                        epoch: "1452988800",
                        pretty: "7:00 PM EST on January 16, 2016",
                        day: 16,
                        month: 1,
                        year: 2016,
                        yday: 15,
                        hour: 19,
                        min: "00",
                        sec: 0,
                        isdst: "0",
                        monthname: "January",
                        monthname_short: "Jan",
                        weekday_short: "Sat",
                        weekday: "Saturday",
                        ampm: "PM",
                        tz_short: "EST",
                        tz_long: "America/New_York"
                    },
                    period: 1,
                    high: {
                        fahrenheit: "49",
                        celsius: "9"
                    },
                    low: {
                        fahrenheit: "31",
                        celsius: "-1"
                    },
                    conditions: "Chance of Rain",
                    icon: "chancerain",
                    icon_url: "http://icons.wxug.com/i/c/k/chancerain.gif",
                    skyicon: "",
                    pop: 40,
                    qpf_allday: {
                        in: 0,
                        mm: 0
                    },
                    qpf_day: {
                        in: 0,
                        mm: 0
                    },
                    qpf_night: {
                        in: 0,
                        mm: 0
                    },
                    snow_allday: {
                        in: 0,
                        cm: 0
                    },
                    snow_day: {
                        in: 0,
                        cm: 0
                    },
                    snow_night: {
                        in: 0,
                        cm: 0
                    },
                    maxwind: {
                        mph: 15,
                        kph: 24,
                        dir: "WNW",
                        degrees: 286
                    },
                    avewind: {
                        mph: 11,
                        kph: 18,
                        dir: "WNW",
                        degrees: 286
                    },
                    avehumidity: 69,
                    maxhumidity: 0,
                    minhumidity: 0
                },
                {
                    date: {
                        epoch: "1453075200",
                        pretty: "7:00 PM EST on January 17, 2016",
                        day: 17,
                        month: 1,
                        year: 2016,
                        yday: 16,
                        hour: 19,
                        min: "00",
                        sec: 0,
                        isdst: "0",
                        monthname: "January",
                        monthname_short: "Jan",
                        weekday_short: "Sun",
                        weekday: "Sunday",
                        ampm: "PM",
                        tz_short: "EST",
                        tz_long: "America/New_York"
                    },
                    period: 2,
                    high: {
                        fahrenheit: "36",
                        celsius: "2"
                    },
                    low: {
                        fahrenheit: "26",
                        celsius: "-3"
                    },
                    conditions: "Overcast",
                    icon: "cloudy",
                    icon_url: "http://icons.wxug.com/i/c/k/cloudy.gif",
                    skyicon: "",
                    pop: 0,
                    qpf_allday: {
                        in: 0,
                        mm: 0
                    },
                    qpf_day: {
                        in: 0,
                        mm: 0
                    },
                    qpf_night: {
                        in: 0,
                        mm: 0
                    },
                    snow_allday: {
                        in: 0,
                        cm: 0
                    },
                    snow_day: {
                        in: 0,
                        cm: 0
                    },
                    snow_night: {
                        in: 0,
                        cm: 0
                    },
                    maxwind: {
                        mph: 10,
                        kph: 16,
                        dir: "NNW",
                        degrees: 340
                    },
                    avewind: {
                        mph: 5,
                        kph: 8,
                        dir: "NNW",
                        degrees: 340
                    },
                    avehumidity: 55,
                    maxhumidity: 0,
                    minhumidity: 0
                },
                {
                    date: {
                        epoch: "1453161600",
                        pretty: "7:00 PM EST on January 18, 2016",
                        day: 18,
                        month: 1,
                        year: 2016,
                        yday: 17,
                        hour: 19,
                        min: "00",
                        sec: 0,
                        isdst: "0",
                        monthname: "January",
                        monthname_short: "Jan",
                        weekday_short: "Mon",
                        weekday: "Monday",
                        ampm: "PM",
                        tz_short: "EST",
                        tz_long: "America/New_York"
                    },
                    period: 3,
                    high: {
                        fahrenheit: "31",
                        celsius: "-1"
                    },
                    low: {
                        fahrenheit: "18",
                        celsius: "-8"
                    },
                    conditions: "Mostly Cloudy",
                    icon: "mostlycloudy",
                    icon_url: "http://icons.wxug.com/i/c/k/mostlycloudy.gif",
                    skyicon: "",
                    pop: 20,
                    qpf_allday: {
                        in: 0,
                        mm: 0
                    },
                    qpf_day: {
                        in: 0,
                        mm: 0
                    },
                    qpf_night: {
                        in: 0,
                        mm: 0
                    },
                    snow_allday: {
                        in: 0,
                        cm: 0
                    },
                    snow_day: {
                        in: 0,
                        cm: 0
                    },
                    snow_night: {
                        in: 0,
                        cm: 0
                    },
                    maxwind: {
                        mph: 25,
                        kph: 40,
                        dir: "WNW",
                        degrees: 300
                    },
                    avewind: {
                        mph: 18,
                        kph: 29,
                        dir: "WNW",
                        degrees: 300
                    },
                    avehumidity: 31,
                    maxhumidity: 0,
                    minhumidity: 0
                },
                {
                    date: {
                        epoch: "1453248000",
                        pretty: "7:00 PM EST on January 19, 2016",
                        day: 19,
                        month: 1,
                        year: 2016,
                        yday: 18,
                        hour: 19,
                        min: "00",
                        sec: 0,
                        isdst: "0",
                        monthname: "January",
                        monthname_short: "Jan",
                        weekday_short: "Tue",
                        weekday: "Tuesday",
                        ampm: "PM",
                        tz_short: "EST",
                        tz_long: "America/New_York"
                    },
                    period: 4,
                    high: {
                        fahrenheit: "32",
                        celsius: "0"
                    },
                    low: {
                        fahrenheit: "25",
                        celsius: "-4"
                    },
                    conditions: "Partly Cloudy",
                    icon: "partlycloudy",
                    icon_url: "http://icons.wxug.com/i/c/k/partlycloudy.gif",
                    skyicon: "",
                    pop: 0,
                    qpf_allday: {
                        in: 0,
                        mm: 0
                    },
                    qpf_day: {
                        in: 0,
                        mm: 0
                    },
                    qpf_night: {
                        in: 0,
                        mm: 0
                    },
                    snow_allday: {
                        in: 0,
                        cm: 0
                    },
                    snow_day: {
                        in: 0,
                        cm: 0
                    },
                    snow_night: {
                        in: 0,
                        cm: 0
                    },
                    maxwind: {
                        mph: 25,
                        kph: 40,
                        dir: "WNW",
                        degrees: 299
                    },
                    avewind: {
                        mph: 19,
                        kph: 31,
                        dir: "WNW",
                        degrees: 299
                    },
                    avehumidity: 35,
                    maxhumidity: 0,
                    minhumidity: 0
                },
                {
                    date: {
                        epoch: "1453334400",
                        pretty: "7:00 PM EST on January 20, 2016",
                        day: 20,
                        month: 1,
                        year: 2016,
                        yday: 19,
                        hour: 19,
                        min: "00",
                        sec: 0,
                        isdst: "0",
                        monthname: "January",
                        monthname_short: "Jan",
                        weekday_short: "Wed",
                        weekday: "Wednesday",
                        ampm: "PM",
                        tz_short: "EST",
                        tz_long: "America/New_York"
                    },
                    period: 5,
                    high: {
                        fahrenheit: "38",
                        celsius: "3"
                    },
                    low: {
                        fahrenheit: "26",
                        celsius: "-3"
                    },
                    conditions: "Clear",
                    icon: "clear",
                    icon_url: "http://icons.wxug.com/i/c/k/clear.gif",
                    skyicon: "",
                    pop: 0,
                    qpf_allday: {
                        in: 0,
                        mm: 0
                    },
                    qpf_day: {
                        in: 0,
                        mm: 0
                    },
                    qpf_night: {
                        in: 0,
                        mm: 0
                    },
                    snow_allday: {
                        in: 0,
                        cm: 0
                    },
                    snow_day: {
                        in: 0,
                        cm: 0
                    },
                    snow_night: {
                        in: 0,
                        cm: 0
                    },
                    maxwind: {
                        mph: 15,
                        kph: 24,
                        dir: "NW",
                        degrees: 313
                    },
                    avewind: {
                        mph: 10,
                        kph: 16,
                        dir: "NW",
                        degrees: 313
                    },
                    avehumidity: 45,
                    maxhumidity: 0,
                    minhumidity: 0
                },
                {
                    date: {
                        epoch: "1453420800",
                        pretty: "7:00 PM EST on January 21, 2016",
                        day: 21,
                        month: 1,
                        year: 2016,
                        yday: 20,
                        hour: 19,
                        min: "00",
                        sec: 0,
                        isdst: "0",
                        monthname: "January",
                        monthname_short: "Jan",
                        weekday_short: "Thu",
                        weekday: "Thursday",
                        ampm: "PM",
                        tz_short: "EST",
                        tz_long: "America/New_York"
                    },
                    period: 6,
                    high: {
                        fahrenheit: "40",
                        celsius: "4"
                    },
                    low: {
                        fahrenheit: "25",
                        celsius: "-4"
                    },
                    conditions: "Clear",
                    icon: "clear",
                    icon_url: "http://icons.wxug.com/i/c/k/clear.gif",
                    skyicon: "",
                    pop: 0,
                    qpf_allday: {
                        in: 0,
                        mm: 0
                    },
                    qpf_day: {
                        in: 0,
                        mm: 0
                    },
                    qpf_night: {
                        in: 0,
                        mm: 0
                    },
                    snow_allday: {
                        in: 0,
                        cm: 0
                    },
                    snow_day: {
                        in: 0,
                        cm: 0
                    },
                    snow_night: {
                        in: 0,
                        cm: 0
                    },
                    maxwind: {
                        mph: 10,
                        kph: 16,
                        dir: "NW",
                        degrees: 311
                    },
                    avewind: {
                        mph: 7,
                        kph: 11,
                        dir: "NW",
                        degrees: 311
                    },
                    avehumidity: 50,
                    maxhumidity: 0,
                    minhumidity: 0
                },
                {
                    date: {
                        epoch: "1453507200",
                        pretty: "7:00 PM EST on January 22, 2016",
                        day: 22,
                        month: 1,
                        year: 2016,
                        yday: 21,
                        hour: 19,
                        min: "00",
                        sec: 0,
                        isdst: "0",
                        monthname: "January",
                        monthname_short: "Jan",
                        weekday_short: "Fri",
                        weekday: "Friday",
                        ampm: "PM",
                        tz_short: "EST",
                        tz_long: "America/New_York"
                    },
                    period: 7,
                    high: {
                        fahrenheit: "39",
                        celsius: "4"
                    },
                    low: {
                        fahrenheit: "26",
                        celsius: "-3"
                    },
                    conditions: "Partly Cloudy",
                    icon: "partlycloudy",
                    icon_url: "http://icons.wxug.com/i/c/k/partlycloudy.gif",
                    skyicon: "",
                    pop: 10,
                    qpf_allday: {
                        in: 0.02,
                        mm: 1
                    },
                    qpf_day: {
                        in: 0,
                        mm: 0
                    },
                    qpf_night: {
                        in: 0.02,
                        mm: 1
                    },
                    snow_allday: {
                        in: 0.2,
                        cm: 0.5
                    },
                    snow_day: {
                        in: 0,
                        cm: 0
                    },
                    snow_night: {
                        in: 0.2,
                        cm: 0.5
                    },
                    maxwind: {
                        mph: 10,
                        kph: 16,
                        dir: "NNW",
                        degrees: 334
                    },
                    avewind: {
                        mph: 7,
                        kph: 11,
                        dir: "NNW",
                        degrees: 334
                    },
                    avehumidity: 51,
                    maxhumidity: 0,
                    minhumidity: 0
                },
                {
                    date: {
                        epoch: "1453593600",
                        pretty: "7:00 PM EST on January 23, 2016",
                        day: 23,
                        month: 1,
                        year: 2016,
                        yday: 22,
                        hour: 19,
                        min: "00",
                        sec: 0,
                        isdst: "0",
                        monthname: "January",
                        monthname_short: "Jan",
                        weekday_short: "Sat",
                        weekday: "Saturday",
                        ampm: "PM",
                        tz_short: "EST",
                        tz_long: "America/New_York"
                    },
                    period: 8,
                    high: {
                        fahrenheit: "38",
                        celsius: "3"
                    },
                    low: {
                        fahrenheit: "26",
                        celsius: "-3"
                    },
                    conditions: "Partly Cloudy",
                    icon: "partlycloudy",
                    icon_url: "http://icons.wxug.com/i/c/k/partlycloudy.gif",
                    skyicon: "",
                    pop: 20,
                    qpf_allday: {
                        in: 0,
                        mm: 0
                    },
                    qpf_day: {
                        in: 0,
                        mm: 0
                    },
                    qpf_night: {
                        in: 0,
                        mm: 0
                    },
                    snow_allday: {
                        in: 0,
                        cm: 0
                    },
                    snow_day: {
                        in: 0,
                        cm: 0
                    },
                    snow_night: {
                        in: 0,
                        cm: 0
                    },
                    maxwind: {
                        mph: 10,
                        kph: 16,
                        dir: "NNE",
                        degrees: 15
                    },
                    avewind: {
                        mph: 8,
                        kph: 13,
                        dir: "NNE",
                        degrees: 15
                    },
                    avehumidity: 60,
                    maxhumidity: 0,
                    minhumidity: 0
                },
                {
                    date: {
                        epoch: "1453680000",
                        pretty: "7:00 PM EST on January 24, 2016",
                        day: 24,
                        month: 1,
                        year: 2016,
                        yday: 23,
                        hour: 19,
                        min: "00",
                        sec: 0,
                        isdst: "0",
                        monthname: "January",
                        monthname_short: "Jan",
                        weekday_short: "Sun",
                        weekday: "Sunday",
                        ampm: "PM",
                        tz_short: "EST",
                        tz_long: "America/New_York"
                    },
                    period: 9,
                    high: {
                        fahrenheit: "43",
                        celsius: "6"
                    },
                    low: {
                        fahrenheit: "32",
                        celsius: "0"
                    },
                    conditions: "Clear",
                    icon: "clear",
                    icon_url: "http://icons.wxug.com/i/c/k/clear.gif",
                    skyicon: "",
                    pop: 20,
                    qpf_allday: {
                        in: 0,
                        mm: 0
                    },
                    qpf_day: {
                        in: 0,
                        mm: 0
                    },
                    qpf_night: {
                        in: 0,
                        mm: 0
                    },
                    snow_allday: {
                        in: 0,
                        cm: 0
                    },
                    snow_day: {
                        in: 0,
                        cm: 0
                    },
                    snow_night: {
                        in: 0,
                        cm: 0
                    },
                    maxwind: {
                        mph: 10,
                        kph: 16,
                        dir: "NW",
                        degrees: 306
                    },
                    avewind: {
                        mph: 7,
                        kph: 11,
                        dir: "NW",
                        degrees: 306
                    },
                    avehumidity: 57,
                    maxhumidity: 0,
                    minhumidity: 0
                },
                {
                    date: {
                        epoch: "1453766400",
                        pretty: "7:00 PM EST on January 25, 2016",
                        day: 25,
                        month: 1,
                        year: 2016,
                        yday: 24,
                        hour: 19,
                        min: "00",
                        sec: 0,
                        isdst: "0",
                        monthname: "January",
                        monthname_short: "Jan",
                        weekday_short: "Mon",
                        weekday: "Monday",
                        ampm: "PM",
                        tz_short: "EST",
                        tz_long: "America/New_York"
                    },
                    period: 10,
                    high: {
                        fahrenheit: "45",
                        celsius: "7"
                    },
                    low: {
                        fahrenheit: "34",
                        celsius: "1"
                    },
                    conditions: "Clear",
                    icon: "clear",
                    icon_url: "http://icons.wxug.com/i/c/k/clear.gif",
                    skyicon: "",
                    pop: 10,
                    qpf_allday: {
                        in: 0.02,
                        mm: 1
                    },
                    qpf_day: {
                        in: 0,
                        mm: 0
                    },
                    qpf_night: {
                        in: 0.02,
                        mm: 1
                    },
                    snow_allday: {
                        in: 0.1,
                        cm: 0.3
                    },
                    snow_day: {
                        in: 0,
                        cm: 0
                    },
                    snow_night: {
                        in: 0.1,
                        cm: 0.3
                    },
                    maxwind: {
                        mph: 10,
                        kph: 16,
                        dir: "SW",
                        degrees: 235
                    },
                    avewind: {
                        mph: 8,
                        kph: 13,
                        dir: "SW",
                        degrees: 235
                    },
                    avehumidity: 61,
                    maxhumidity: 0,
                    minhumidity: 0
                }
            ]
        }
    }
};

// scoreLogic();
// performLogic(req, res);
