var express = require('express');
var router = express.Router();
var comparison = require('../../lib/comparison');
var city = require('../../models/city');

router.use(function (req, res, next) {
  if (!req.user){
    res.json({status: 302, description:'user not verified'});
  } else {
    next();
  }
});

router.get('/',  function (req, res) {
  res.render('profile', {username});
})

var getCityData = require('../../lib/comparison.js');
router.get('/best', getCityData);

module.exports = router;
