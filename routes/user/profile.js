var express = require('express');
var router = express.Router();
var city = require('../../models/city');
var User = require('../../models/user')

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
  var newUser = new User(req.body);
  newUser.save(function(err, databaseUser) {
    res.json(databaseUser);
  });
});

router.patch('/edit', function(req, res) {
  User.findByIdAndUpdate(req.params.id, req.body, {new: true}, function(err, databaseUser) {
    res.json(databaseUser);
    });
});

// router.delete('/User/:id', function (req, res) {
//   console.log('deleting');
//   User.findByIdAndRemove(req.params.id, function (err) {
//     if (err) {res.status(500).end();}
//     res.status(204).end();
//   });
//
// });

module.exports = router;
