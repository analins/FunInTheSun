var mongoose = require('mongoose');
var bcryptjs = require('bcryptjs');
var crypto = require('crypto');
var citySchema = require('./city');

var UserSchema = mongoose.Schema({
  username: {type: String required: true, index: { unique: true } },
  password: {type: String, required: true},
  token: {type: String},
  firstname: {type: String}, 
  lastname: {type: String},
  cities: {
    main: String,
    favorites: [citySchema]
  }
});


UserSchema.pre('save', function (next) {
  if( this.isModified('password')){
    this.password = bcryptjs.hashSync(this.password, 10);
  }
  return next();
});

UserSchema.methods.authenticate = function (passwordTry, callback) {
  bcryptjs.compare(passwordTry, this.password, function (err, isMatch) {
    if (err) {return callback(err)}
    callback(null, isMatch);
  });
};

UserSchema.methods.setToken = function (err, callback) {
  var scope = this;
  crypto.randomBytes(256, function (err, rawToken) {
    scope.token = rawToken;
    scope.save(function () {
      if (err) {return callback(err)};
      callback();
    });
  })
}

module.exports = mongoose.model('User', UserSchema);
