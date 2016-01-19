console.log('.....loaded.....');


//**********  USER FUNCTIONS  **********//
//**********  USER FUNCTIONS  **********//
//**********  USER FUNCTIONS  **********//
//**********  USER FUNCTIONS  **********//
//**********  USER FUNCTIONS  **********//

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
        url: '/user/edit',
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

// // Update a User
// function updateUser(userData, callback) {
//   $.ajax( {
//     method: 'patch',
//     url: '/api/users',
//     data: {user: userData},
//     success: function(data) {
//       callback(data);
//     }
//   });
// }



//**********  CITY FUNCTIONS  **********//
//**********  CITY FUNCTIONS  **********//
//**********  CITY FUNCTIONS  **********//
//**********  CITY FUNCTIONS  **********//
//**********  CITY FUNCTIONS  **********//

function saveNewCities(cityData, callback) {
  $.ajax( {
    method: 'post',
    url: '/api/users',
    data: cityData,
    success: function(data) {
      callback(data);
    }
  });
}

// // Create a new user in db
// function createUser(userData, callback){
//     $.ajax({
//         method: 'post',
//         url: '/api/users',
//         data: userData,
//         success: function(data){
//             callback(data);
//         }
//     });
// }

// // Update a User
// function updateUser(userData, callback) {
//     $.ajax( {
//         method: 'patch',
//         url: '/user/edit',
//         data: userData,
//         success: function(data) {
//             callback(data);
//         }
//     });
// }

function setSaveNewCitiesFormHandler(callback) {
  $('form#addcity-form').on('submit', function(e) {
    e.preventDefault();

    var formObj = $(this).serializeObject();
    console.log(formObj);

    updateCity(formObj, function(city) {
      console.log(city);
    });
  });
}


function getFavCities(callback) {
    callback = callback || function(){};
    $.ajax({
        url: '/api/users/cities/favorite',
        error: function(error){
            console.log("Error: No favorite cities yet.");
        },
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
    setEditUserFormHandler();
    setObtainNewCitiesFormHandler();
    logOut();
    $('.modal-trigger').leanModal();
    $(".button-collapse").sideNav();
    $('#getCities').on('click', getFavCities);
});
