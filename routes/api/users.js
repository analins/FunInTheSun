var express = require('express');
var router = express.Router();
var User = require('../../models/user');
var request = require('request'); // for server-side HTTP requests

router.get('/', function (req, res) {
  User.findById(req.user._id, function (err, dbUser) {
    res.json(dbUser);
  });
});

router.post('/', function (req, res) {
  var newUser = new User(req.body.user);
  newUser.save(function (err, dbUser) {
    //res.json(dbUser);
    res.redirect('/');
  });
});

// router.patch('/', function (req, res) {
//   if(req.user){
//     req.user.save(function (err, dbUser) {
//       res.json(dbUser);
//     });
//   }
// });

router.post('/authenticate', function (req, res) {
  console.log('checking...');
  User.findOne({username: req.body.username}, function (err, dbUser) {
    if (dbUser){
      dbUser.authenticate(req.body.password, function (err, isMatch) {
        if (isMatch) {
          dbUser.setToken(err, function () {
            res.json({description: 'success', token: dbUser.token});

          });
          //res.redirect('/user');
        }
      });
    } else {
      res.json({description: 'No Success', status: 302});
    }
  });
});



//Cities Routes -------------

router.post('/cities', function (req, res) {
  if (req.user) {
    req.user.cities.favorites.push(req.body.user);
    req.user.save(function (err, dbUser) {
      res.json(dbUser);
    });
  }
});

router.delete('/cities/:id', function (req, res) {
  console.log('deleting');
  User.cities.favorites.findByIdAndRemove(req.params.id, function (err) {
    if (err) {res.status(500).end();}
    res.status(204).end();
  });

});


router.get('/cities/:id/directions', function (req, res) {
  console.log('Getting Directions...');
  city = User.cities.favorites.findById(req.params.id, function (data) {
      city.zipcode = "19060";
      req.zipcode = "11226";
      url= "https://maps.googleapis.com/maps/api/directions/json?origin=" + city.zipcode + "&destination=" + req.zipcode;
      request(url, function(err, response, body){
          res.json(JSON.parse(body));
      });
  });

});


//Rank the cities by conditions and return an array of cities
var getCityData = require('../../lib/comparison.js');
router.get('/cities/best', getCityData);



module.exports = router;
