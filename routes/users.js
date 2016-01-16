var express = require('express');
var router = express.Router();



//When request comes to /best route run getCityData function
var getCityData = require('../lib/comparison.js');
router.get('/best', getCityData);//g



module.exports = router;
