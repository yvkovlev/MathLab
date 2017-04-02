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
    $('#anchor').viewportChecker({
        offset: 0,
        callbackFunction: function() {
        	alert("Yeap!");
        }
    });
});