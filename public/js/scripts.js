console.log('.....loaded.....');

// Create a new user in db
function createUser(userData, callback){
  $.ajax({
    method: 'post',
    url: '/api/users',
    data: userData,
    success: function(data){
      callback(data);
    }
  });
}

// New user sign up form
function setCreateUserFormHandler(){
  $('form#sign-up').on('submit', function(e) {
    e.preventDefault();

    var formObj = $(this).serializeObject();
    console.log(formObj);

    createUser(formObj, function(user){
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

//LOGOUT FUNCTION
function logOut() {
  $('.logout').on('click', function () {
    $.removeCookie('token');
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

//SHOW ELEMENTS UPON LOGIN
function showHideElements() {
  if ($.cookie('token')) {
    $('.profile-content').show();
  } else {
    $('.profile-content').hide();
  }
}

$(function () {
  setCreateUserFormHandler();
  setLogInFormHandler();
  logOut();
   $('.modal-trigger').leanModal();
    $(".button-collapse").sideNav();
});
