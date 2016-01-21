var express = require('express');
var router = express.Router();
var request = require('request'); // for server-side HTTP requests

router.get('/autocomplete', function(req, res){
    var url = "http://autocomplete.wunderground.com/aq?query=" + req.query.search;
    request(url, function(err, response, body){
        body = JSON.parse(body);
        results = body.RESULTS.slice(0,6); //send back first six results
        res.json(results);
    });
});

//default city weather
router.get('/', function (req, res) {
  console.log("Default Weather");
  var url = "http://api.wunderground.com/api/" + process.env.WUAPIKEY + "/conditions/q/" + req.user.cities.main.zipcode + ".json";

  request(url, function (err, response, body) {
    res.json(JSON.parse(body));
  });
});

module.exports = router;
