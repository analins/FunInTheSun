console.log('profile display loaded');

//**********  DEFAULT WEATHER RENDERING  **********//

function getCurrentWeather() {
  var zipcode = $('#zipcode').text();
  $.getJSON("http://api.wunderground.com/api/" + process.env.WUAPIKEY + "/conditions/q/" + zipcode + ".json", function (data) {
    renderWeatherResults(data);
    console.log(data);
  });
}

function renderWeatherResults(data) {
  var source = $('#default-weather').html();
  var template = Handlebars.compile(source);
  var compiledHtml = template(data);
  $('#current-weather').html(compiledHtml);
}

//**********  RADIUS BASED WEATHER **********//
