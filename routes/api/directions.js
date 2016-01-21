var express = require('express');
var router = express.Router();
var request = require('request'); // for server-side HTTP requests

router.get('/', function (req, res) {
  console.log('Getting Directions...');
    url= "https://maps.googleapis.com/maps/api/directions/json?origin=" + req.user.cities.main.zipcode + "&destination=" + req.query.zip;
    console.log(url);
    request(url, function(err, response, body){
      res.json(JSON.parse(body));
    });
});

module.exports = router;
