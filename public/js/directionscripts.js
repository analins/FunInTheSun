console.log('loaded!!');

function renderDirections(data) {
  var source = $('#directions').html();
  var template = Handlebars.compile(source);
  var compiledHtml = template(data);
  $('#directions-body').html(compiledHtml);
  $('#directions-modal').openModal();
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
                renderDirections(data);
            }
        });
    });
}



$(function () {
  // directionsResults();
  printDirections();
  directionsFormListener();
});
