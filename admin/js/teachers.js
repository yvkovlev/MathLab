function loadTeachers(lastID) {
  $.ajax({
    url: 'api/loadTeachers',
    method: 'post',
    data: {lastID: lastID},
    success: function(response) {
      console.log(response);
    }
  });
}

$(document).ready(function() {

});