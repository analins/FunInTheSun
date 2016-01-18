console.log('.....loaded.....');

// Create a new user in db
function createUser(userData, callback){
  $.ajax({
    method: 'post',
    url: '/api/users',
    data: {user: userData},
    success: function(data){
      callback(data);
    }
  });
}

// New user sign up form
function setCreateUserFormHandler(){
  $('form#sign-up').on('submit', function(e) {
    e.preventDefault();

    var usernameField = $(this).find('input[name="username"]');
    var usernameText = usernameField.val();
    usernameField.val('');

    var passwordField = $(this).find('input[name="password"]');
    var passwordText = passwordField.val();
    passwordField.val('');

<<<<<<< HEAD
    var userData = {username: usernameText, password: passwordText};
=======
    var firstnameField = $(this).find('input[name="firstname"]');
    var firstnameText = firstnameField.val();
    firstnameField.val('');

    var lastnameField = $(this).find('input[name="lastname"]');
    var lastnameText = lastnameField.val();
    lastnameField.val('');

    var cityField = $(this).find('input[name="city"]');
    var cityText = cityField.val();
    cityField.val('');

    var zipcodeField = $(this).find('input[name="zipcode"]');
    var zipcodeText = zipcodeField.val();
    zipcodeField.val('');

<<<<<<< HEAD
    var userData = {username: usernameText, password: passwordText, firstname: firstnameText, lastname: lastnameText, main: cityText, zipcode: zipcodeText};
>>>>>>> 6afddc1... updates main: cityText in setCreateUserFormHandler
=======
    var userData = {username: usernameText, password: passwordText, firstname: firstnameText, lastname: lastnameText, cities(main): cityText, zipcode: zipcodeText};
>>>>>>> 0b466dc... modifies setCreateUserFormHandler
    console.log(userData);

    createUser(userData, function(user){
      console.log(user);
    });
  });
}

// Log in an existing user
function logInUser(usernameAttempt, passwordAttempt, callback){
  $.ajax({
    method: 'post',
    url: '/api/users/authenticate',
    data: {username: usernameAttempt, password: passwordAttempt},
    success: function(data) {
      callback(data);
    }
  });
}

// Log in user form
function setLogInFormHandler() {
  $('form#log-in').on('submit', function(e) {
    e.preventDefault();

    var usernameField = $(this).find('input[name="username"]');
    var usernameText = usernameField.val();
    usernameField.val('');

    var passwordField = $(this).find('input[name="password"]');
    var passwordText = passwordField.val();
    passwordField.val('');

    var userData = {username: usernameText, password: passwordText, firstname: firstnameText, lastname: lastnameText, main: cityText, zipcode: zipcodeText};
      logInUser(usernameText, passwordText, function(data) {

      $.cookie('token', data.token);
      console.log('Token:', $.cookie('token') );
    });
  });
}



<<<<<<< HEAD
=======
function getUser(callback) {
  $.ajax( {
    url: '/api/users/id',
    success: function(data) {
      var user = data.user;
      callback(user);
    }
  });
}

// Update a User
function updateUser(userData, callback) {
  $.ajax( {
    method: 'patch',
    url: '/api/users',
    data: {user: userData},
    success: function(data) {
      callback(data);
    }
  });
}

>>>>>>> 0b466dc... modifies setCreateUserFormHandler

function getCities(callback) {
  callback = callback || function(){};
  $.ajax({
    url: 'XXXXXXXXX',
    success: function(data){
      var source = $('#city-data').html();
      var template = Handlebars.compile(source);
      var compileHtml = template(data);
      $('#render-cities').html(compileHtml);
    }
  });
}

$(function () {
  setCreateUserFormHandler();
  setLogInFormHandler();
   $('.modal-trigger').leanModal();
});
