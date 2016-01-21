var express = require('express');
var router = express.Router();
var User = require('../../models/user');
var request = require('request'); // for server-side HTTP requests

router.get('/', function (req, res) {
  User.findById(req.user._id, function (err, dbUser) {
    res.json(dbUser);
  });
});

router.get('/all', function (req, res) {
  User.find({}, function (err, dbUser) {
    res.json(dbUser);
  });
});

router.post('/', function (req, res) {
  var newUser = new User(req.body);
  newUser.save(function (err, dbUser) {
      console.log("err:", err);
    console.log("dbUser:", dbUser);
    res.json(dbUser);
  });
});

router.patch('/edit', function (req, res) {
    User.findByIdAndUpdate(req.user._id, req.body, {new: true}, function(err, dbUser){
        res.json(dbUser);
    });

});

router.post('/authenticate', function (req, res) {
  console.log('checking...');
  User.findOne({username: req.body.username}, function (err, dbUser) {
    if (dbUser){
      dbUser.authenticate(req.body.password, function (err, isMatch) {
        if (isMatch) {
          dbUser.setToken(err, function () {
            res.json({description: 'success', token: dbUser.token});

          });
// res.redirect('/user');
        }
      });
    } else {
      res.json({description: 'No Success', status: 302});
    }
  });
});



//Cities Routes -------------

router.get('/cities', function (req, res) {
  User.findById(req.user._id, function (err, dbUser) {
    res.json(dbUser);

  });
});



router.post('/cities', function (req, res) {
    User.findById(req.user._id, function(err, dbUser) {
        console.log(req.body);
        dbUser.cities.favorites.push(req.body);
        dbUser.save(function (err, user) {
            res.json(user);
            console.log('....fav_city_saved.....');
        });
    });
});



router.delete('/cities/:id', function (req, res) {
  console.log('deleting');
  User.cities.favorites.findByIdAndRemove(req.body.favorite, function (err) {
    if (err) {res.status(500).end();}
    res.status(204).end();
  });

});


//Rank the cities by conditions and return an array of cities
var getCityData = require('../../lib/comparison.js');
router.get('/cities/best', getCityData);





module.exports = router;
