var citiesArr;

function getCityData (req, res, callback) {
    //Loop for all of the needed data requests on the req.user
    console.log("Getting each city's data...");
    var dbCities = req.user.cities.favorite;
    //for each city in the user's city list
    for (var i = 0; i < dbCities.length; i++) {
        $.ajax({
            method: 'get',
            url: comment,//url + '/q/' + process.env.APIKEY + "/" + state + "/" + city
            success: addCityData
        });
    }

    //Once you have the data go call the scoreLogic function passing the req and res with it
    scoreLogic(req, res);
}

function addCityData (cityData) {
    //get the necessary info from an ajax call and add the JSON object to the citiesArr
    citiesArr.push(cityData);
}
function scoreLogic (req, res){
    //With all the city information in an array find all of their scores
    console.log("Scoring each city...");
    //go through each of the pieces of the data, value them all, and assign them to a score key on the object
    for (var i = 0; i < citiesArr.length; i++) {
        citiesArr[i].score = 0;
    }
    //send it off for sorting
    comparison(req, res);
}


function comparison (req, res) {
    console.log("Sorting by their score...");

    //sort the cities by that key.
    citiesArr.sort(function(a, b){
        return a.score - b.score;
    });

    console.log("... and responding with json of", {cities: sortedCities});
    return res.json({cities: citiesArr});
}

module.exports = getCityData;
