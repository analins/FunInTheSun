console.log('profile display loaded');

//**********  DEFAULT WEATHER RENDERING  **********//

function getCurrentWeather() {

  $.ajax({
    method: 'get',
    url: '/api/weather',
    success: function (data) {
      renderWeatherResults(data);
      weatherBackground();
    }
  });
  $('#current-weather').html($('#loader').html());
}

function renderWeatherResults(data) {
  var source = $('#default-weather').html();
  var template = Handlebars.compile(source);
  var compiledHtml = template(data);
  $('#current-weather').html(compiledHtml);
}


function weatherBackground() {
  var conditions = $('#weather-description').text();
  console.log(conditions)
  if ( /sunny$|clear$|^partly/i.test(conditions) ) {
    $('body').css({'background-image': 'url("/images/profileview/sea-sky-beach-holiday.jpeg")'});
  }
  if (/cloudy$|fog$|haze$|overcast$/i.test(conditions) ) {
    $('body').css({'background-image': 'url("/images/profileview/nature-sky-clouds-cloudy.jpg")'});
  }
  if (/flurries$|snow$|sleet$/i.test(conditions) ) {
      $('body').css({'background-image': 'url("/images/profileview/snow-forest-trees-winter.jpeg")'});
  }
  if (/rain$|^thunder/i.test(conditions) ) {
      $('body').css({'background-image': 'url("/images/profileview/city-weather-glass-skyscrapers.jpg")'});
  }

}

function cityWeatherBackground(data) {


  $('img.activator').each(function (i, card) {
    var condition = data.cities[i].forecast.simpleforecast.forecastday[0].icon;
    if ( /sunny$|clear$/.test(condition) ){
      $(this).attr('src', '/images/cities/sky-sunny-clouds-cloudy.jpg');
    }
    if ( /cloudy$|fog$|hazy$/.test(condition) ){
      $(this).attr('src', '/images/cities/snow-dawn-nature-sky.jpg');
    }
    if ( /snow$|flurries$/.test(condition) ){
      $(this).attr('src', '/images/cities/snow-forest-trees-winter.jpeg');
    }
    if ( /rain$|tstorms$|sleet$/.test(condition) ){
      $(this).attr('src', '/images/cities/city-lights-night-clouds.jpg');
    }
  });
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
            cityWeatherBackground(data);
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
