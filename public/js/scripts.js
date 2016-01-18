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

    var userData = {username: usernameText, password: passwordText};
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

    var userData = {username: usernameText, password: passwordText};
      logInUser(usernameText, passwordText, function(data) {

      $.cookie('token', data.token);
      console.log('Token:', $.cookie('token') );
    });
  });
}


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
});
