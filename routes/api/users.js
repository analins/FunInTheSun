var express = require('express');
var router = express.Router();
var User = require('../../models/user');

router.get('/', function (req, res) {
  User.find({}, function (err, dbUsers) {
    res.json({users: dbUsers});
  });
});

router.post('/', function (req, res) {
  var newUser = new User(req.body.user);
  newUser.save(function (err, dbUser) {
    res,json(dbUser);
  });
});

router.patch('/', function (req, res) {
  if(req.user){
    req.user.save(function (err, dbUser) {
      res.json(dbUser);
    });
  }
});

router.post('/authenticate', function (req, res) {
  User.findOne({username: req.body.username}, function (err, dbUser) {
    if (dbUser){
      dbUser.authenticate(req.body.password, function (err, isMatch) {
        if (isMatch) {
          dbUser.setToken(err, function () {
            res.json({description: 'success'. token: dbUser.token});
          });
        }
      });
    } else {
      res.json({description: 'No Success', status: 302});
    }
  });
});


module.exports = router;
