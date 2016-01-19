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

router.patch('/user', function(req, res) {
  if (req.user) {
    req.user = req.body.user;

    req.user.save(function(err, databaseUser) {
      res.json(databaseUser);
    });
  }
});

// router.delete('/cities/:id', function (req, res) {
//   console.log('deleting');
//   User.cities.favorites.findByIdAndRemove(req.params.id, function (err) {
//     if (err) {res.status(500).end();}
//     res.status(204).end();
//   });
//
// });

module.exports = router;
