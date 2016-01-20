console.log('profile display loaded');

//**********  DEFAULT WEATHER RENDERING  **********//

function getCurrentWeather() {
  $.ajax({
    method: 'get',
    url: '/api/users/defaultweather',
    success: function (data) {
      renderWeatherResults(data);
    }
  });
}

function renderWeatherResults(data) {
  var source = $('#default-weather').html();
  var template = Handlebars.compile(source);
  var compiledHtml = template(data);
  $('#current-weather').html(compiledHtml);
}

//**********  RADIUS BASED WEATHER **********//
