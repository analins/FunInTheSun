var mongoose = require('mongoose');
var bcryptjs = require('bcryptjs');
var crypto = require('crypto');

var UserSchema = mongoose.Schema({
  username: {type: String},
  password: {type: String},
  token: {type: String},
  name: {first: String, last: String},
  lastname: {type: String},
  cities: {
    main: citySchema,
    favorites: [citySchema]
  }
});




module.exports = mongoose.model('User', UserSchema);
