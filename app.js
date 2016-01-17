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

// <<< Added By Nat >>> Index View route:  `/`
var index = require('./routes/index');
app.use('/', index);

var users = require('./routes/api/users');
app.use('/api/users', users);

// var userIndex = require('./routes/users/profile');
// app.use('/user', profile);

// -----------------------
// ****** LISTEN ******
// -----------------------

var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('listening on ' + port);
});
