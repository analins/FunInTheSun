console.log('loaded!!');

function renderDirections(data) {
  var source = $('#directions').html();
  var template = Handlebars.compile(source);
  var compiledHtml = template(data);
  $('#directions-body').html(compiledHtml);
  $('#directions-modal').openModal();
  // directionsFormListener();
}

function printDirections() {
  $('#print').on('click', function () {
    var printBody = $('#directions-body').html();
    $('#profile-container').hide();
    $('.printable-area').html(printBody);
    window.print();
  });
  $('.printable-area').empty('');
  $('#profile-container').show();
}
function directionsFormListener () {
    $(".directions-form").on('submit' , function(e){
        e.preventDefault();

        $.ajax({
            method: 'get',
            data: {zip: $(this).find('.form-zip').val()},
            url: '/api/directions',
            success: function (data) {
                console.log(data);
                renderDirections(data);
            }
        });
    });
}



$(function () {
  printDirections();
});
