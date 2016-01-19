console.log('loaded!!');

function directionsResults() {
    $.getJSON('https://maps.googleapis.com/maps/api/directions/json?origin=19060&destination=11226&callback=?', function(data){
      renderDirections(data);
      console.log(data);
    });
  }


function renderDirections(data) {
  var source = $('#directions').html();
  var template = Handlebars.compile(source);
  var compiledHtml = template(data);
  $('#directions-body').html(compiledHtml);
}

function printDirections() {
  $('#print').on('click', function () {
    var printBody = $('#directions-body').html();
    $('.container').hide();
    $('.printable-area').html(printBody);
    window.print();
  });
}
function directionsFormListener () {
    form = $('#directions-form');
    form.on('submit', function(e){
        e.preventDefault();

        $.ajax({
            method: 'get',
            data: {zip: form.find('#form-zip').val()},
            url: '/api/users/cities/directions',
            success: function (data) {
                console.log(data);
            }
        });
    });
}



$(function () {
  // directionsResults();
  // printDirections();
  directionsFormListener();
});
