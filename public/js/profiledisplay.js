console.log('profile display loaded');

//**********  DEFAULT WEATHER RENDERING  **********//

function getCurrentWeather() {

  $.ajax({
    method: 'get',
    url: '/api/weather',
    success: function (data) {
      renderWeatherResults(data);
      weatherBackground(data);
    }
  });
}

function renderWeatherResults(data) {
  var source = $('#default-weather').html();
  var template = Handlebars.compile(source);
  var compiledHtml = template(data);
  $('#current-weather').html(compiledHtml);
}


function weatherBackground(data) {
  var data = data.current_observation.weather;

  if ( /sunny$|clear$|^partly/.test(data) ) {
    $('body').css({'background-image': 'url("/images/profileview/sea-sky-beach-holiday.jpeg")'});
  }
  if (/cloudy$|fog$|haze$|overcast$/.test(data) ) {
    $('html').css({'background-image': 'url("/images/profileview/nature-sky-clouds-cloudy.jpg")'});
  }
  if (/flurries$|snow$|sleet$/.test(data) ) {
      $('html').css({'background-image': 'url("/images/profileview/snow-forest-trees-winter.jpeg")'});
  }
  if (/rain$|^thunder/.test(data) ) {
      $('html').css({'background-image': 'url("/images/profileview/city-weather-glass-skyscrapers.jpg")'});
  }
}

function getComparedCities(callback) {
    callback = callback || function(){};
    $.ajax({
        method: 'get',
        url: '/api/users/cities/best',
        error: function(error){
            console.log("Error: No favorite cities yet.");
        },
        success: function(data){
          console.log(data);
            var source = $('#city-data').html();
            var template = Handlebars.compile(source);
            var compileHtml = template(data);
            $('#results-list').html(compileHtml);
            directionsFormListener(); // Set handler for each of the get directions buttons
        }
    });
    $('#results-list').html($('#loader').html());
}

//**********  BEST WEATHER **********//

// function getBestWeather() {
//   $.ajax({
//     method: 'get',
//     url: '/api/users/cities/best',
//     success: function (data) {
//       console.log(data);
//       renderBestResults(data)
//     }
//   });
// }
//
// function renderBestResults(data) {
//   var source = $('#best-weather').html();
//   var template = Handlebars.compile(source);
//   var compiledHtml = template(data);
//   $('#best-results').html(compiledHtml);
// }




//**********|||**********|||**********//

$(function () {
  getCurrentWeather();
  $('#getCities').on('click', getComparedCities);
});
