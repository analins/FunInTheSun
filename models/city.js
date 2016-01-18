var mongoose = require('mongoose');

var CitySchema = mongoose.Schema({
  name: {type: String},
  nickname: {type: String},
  zipcode: {type: String},
});


module.exports = mongoose.model('City', CitySchema);
