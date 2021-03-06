console.log('.....loaded.....');


//**********  CREATE USER FUNCTIONS  **********//

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

        $('#sign-up-modal').closeModal();
        createUser(formObj, function(user){
            console.log("Form response:", user);
        });

    });
}

//**********  LOGIN/OUT USER FUNCTIONS  **********//

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
    $('.login-form').on('submit', function(e) {
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
            window.location="/user";
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
        url: '/api/users/edit',
        data: userData,
        success: function(data) {
            callback(data);
        }
    });
}


// Edit user form
function setEditUserFormHandler(){
    $('form#edit-user').on('submit', function(e) {
        e.preventDefault();
        var formObj = $(this).serializeObject();
        console.log(formObj);

        updateUser(formObj, function(user){
            console.log(user);
        });
    });

    var lever = $('form#edit-user .lever');
    var radius = $('form#edit-user [type="hidden"]');
    lever.on('click', function(){
        (radius.val() == "true") ? radius.val("false") : radius.val("true");
    });
}





//**********  CITY FUNCTIONS  **********//
//**********  CITY FUNCTIONS  **********//
//**********  CITY FUNCTIONS  **********//
//**********  CITY FUNCTIONS  **********//
//**********  CITY FUNCTIONS  **********//

function saveFavCity(cityData, callback) {
  $.ajax( {
    method: 'post',
    url: '/api/users/cities',
    data: cityData,
    success: function(data) {
      callback(data);
    }
  });
}



function setSaveFavCityFormHandler(callback) {
  $('form#addcity-form').on('submit', function(e) {
    e.preventDefault();

    var formObj = $(this).serializeObject();
    console.log(formObj);

    $('#addcity-modal').closeModal();
    saveFavCity(formObj, function(city) {
      console.log(city, " is saved!!!");
    });
  });
}


function deleteCity(cityData, callback) {
  $.ajax( {
    method: 'delete',
    url: 'api/users/cities',
    data: {zip: cityData},
    success: function(data) {
      remove(data);
    }
  });
}

 function deleteCityButton(){
  $('.delete').on('click', function() {
    $('#response').text();
    var cityZip = $(this).attr('id');
    deleteCity(cityZip, callback);

  })
}



//SHOW ELEMENTS UPON LOGIN
function showHideElements() {
    if ($.cookie('token')) {
        $('#nav ul').show();
    } else {
        $('#nav ul').hide();
    }
}

$(function () {
    setCreateUserFormHandler();
    setLogInFormHandler();
    setEditUserFormHandler();
    setSaveFavCityFormHandler();
    deleteCityButton();
    logOut();


    showHideElements();
});
