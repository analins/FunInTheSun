var express = require('express');
var router = express.Router();
var citiesArr;

//When request comes to /best route run getCityData function
router.get('/best', getCityData);

function getCityData (req, res, callback) {
    //Loop for all of the needed data requests on the req.user
    console.log("Getting each city's data...");

    //Once you have the data go call the scoreLogic function passing the req and res with it
    return scoreLogic(req, res, cities);
}


function scoreLogic (req, res, dataArr){
    //With all the city information in an array find all of their scores
    console.log("Scoring each city...");
    //send it off for sorting
    return comparison(req, res, cities);
}


function comparison (req, res, scoresArr) {
    console.log("Sorting by their score...");

    console.log("... and responding with json of", {cities: sortedCities});
    return res.json({cities: sortedCities});
}


module.exports = router;
