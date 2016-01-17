console.log(.....loaded.....);

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
