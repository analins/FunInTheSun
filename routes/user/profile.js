var express = require('express');
var router = express.Router();
var city = require('../../models/city');

router.use( function (req, res, next) {
  if (!req.user){
    res.json({status: 302, description:'user not verified'});
  } else {
    next();
  }
});

router.get('/',  function (req, res) {
  res.render('user/profile', {user: req.user});
});

router.post('/', function(req, res) {
  var newUser = new User(req.body.user);
  newUser.save(function(err, databaseUser) {
    res.json(databaseUser);
  });
});

module.exports = router;
