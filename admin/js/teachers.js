function loadTeachers(lastID) {
  $.ajax({
    url: 'api/loadTeachers',
    method: 'post',
    data: {lastID: lastID},
    success: function(response) {
      var teachers = "";
      response.forEach(function(teacher, response){
        teachers += 
          "<tr id='" + teacher._id + "'>" +
            "<td>" + teacher.fullname + "</td>" +
            "<td>" + teacher.email + "</td>" +
            "<td>" + teacher.phone + "</td>" +
            "<td>" + teacher.sex + "</td>" + 
            "<td>" + teacher.subject + "</td>" + 
            "<td>$320,800</td>" +
          "</tr>";
      });
      $('tbody').append(teachers);
    }
  });
}

$(document).ready(function() {
    $('#anchor').viewportChecker({
        offset: 0,
        callbackFunction: function() {
        	if (!$('tbody tr').length) loadTeachers("000000000000000000000000");
          else loadTeachers($("tbody tr:last-child").attr('id'));
        }
    });
});