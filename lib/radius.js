require('dotenv').load();
var request = require('request');


var zip = user.cities.main.zipcode;
'https://www.zipcodeapi.com/rest/' + process.env.ZIPAPIKEY +'/radius.radius.json/'+ zip +'/150/mile'
