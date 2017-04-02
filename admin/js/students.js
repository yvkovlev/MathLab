function loadStudents(lastID) {
  $.ajax({
    url: 'api/loadStudents',
    method: 'post',
    data: {lastID: lastID},
    success: function(response) {
      var students = "";
      console.log(response);
      response.forEach(function(student, response){
        students += 
          "<tr id='" + student._id + "'>" +
            "<td>" + student.fullname + "</td>" +
            "<td>" + student.email + "</td>" +
            "<td>" + student.phone + "</td>" +
            "<td>" + student.grade + "</td>" + 
            "<td>" + student.sex + "</td>" + 
            "<td>" + student.confirmed + "</td>" + 
          "</tr>";
      });
      $('tbody').append(students);
    }
  });
}

$(document).ready(function() {
    $('#anchor').viewportChecker({
        offset: 0,
        callbackFunction: function() {
        	if (!$('tbody tr').length) loadStudents("000000000000000000000000");
          else loadStudents($("tbody tr:last-child").attr('id'));
        }
    });
});