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

//**********  BEST WEATHER **********//

function getBestWeather() {
  $.ajax({
    method: 'get',
    url: '/api/users/cities/best',
    success: function (data) {
      console.log(data);
      renderBestResults(data)
    }
  });
}

function renderBestResults(data) {
  var source = $('#best-weather').html();
  var template = Handlebars.compile(source);
  var compiledHtml = template(data);
  $('#best-results').html(compiledHtml);
}


//**********|||**********|||**********//

$(function () {
  getCurrentWeather();

})
