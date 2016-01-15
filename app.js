var express = require('express');
var app = express();

var morgan = require('morgan');
app.use( morgan('dev') );

require('dotenv').load();


// Public: Set publically accessible directory
app.use(express.static('./public'));

// Body Parser: Read all the body information
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded());

// Cookies Parser: Read all the Cookie information
var cookieParser = require('cookie-parser');
app.use(cookieParser());

// Custom middleware to load user


// EJS: Template Rendering
app.set('view engine', 'ejs');

var mongoPath = process.env.MONGOLAB_URI || 'mongodb://localhost/funinthesun';
var mongoose = require('mongoose');
mongoose.connect(mongoPath);


app.listen(parseInt(process.env.PORT) || 3000, function () {
  console.log('listening 3000');
});
