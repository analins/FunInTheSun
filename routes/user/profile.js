var express = require('express');
var router = express.Router();
var User = require('../../models/user');

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


module.exports = router;
