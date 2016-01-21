// -------------------------------------
// ****** MODULES & MIDDLEWARE ******
// -------------------------------------

var express = require('express');
var app = express();

var morgan = require('morgan');
app.use( morgan('dev') );

require('dotenv').load();

app.use(express.static('./public'));

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

var cookieParser = require('cookie-parser');
app.use(cookieParser());

var loadUser = require('./middleware/loadUser');
app.use(loadUser);

app.set('view engine', 'ejs');

var mongoPath = process.env.MONGOLAB_URI || 'mongodb://localhost/funinthesun';
var mongoose = require('mongoose');
mongoose.connect(mongoPath);

// -----------------------
// ****** ROUTING ******
// -----------------------

// View routes -------------
var index = require('./routes/index');
app.use('/', index);

var profile = require('./routes/user/profile');
app.use('/user', profile);

// API routes ---------------

// Our API
var users = require('./routes/api/users');
app.use('/api/users', users);

// Weather Underground
var weather = require('./routes/api/weather');
app.use('/api/weather', weather);

// Google Directions
var directions = require('./routes/api/directions');
app.use('/api/directions', directions);

// Zipcode
var zipcodes = require('./routes/api/zipcodes');
app.use('/api/zipcodes', zipcodes);



// -----------------------
// ****** LISTEN ******
// -----------------------

var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('listening on ' + port);
});
