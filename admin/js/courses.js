var pending = true;
var firstLoad = true;
var endList = false;
var currenTr;


function loadCourses(lastID) {
  $.ajax({
    url: 'api/loadCourses',
    method: 'post',
    data: {lastID: lastID},
    beforeSend: function() {
      pending = true;
    },
    success: function(response) {
      var courses = "";
      pending = false;
      response.forEach(function(course, response){
        courses += 
          "<tr id='" + course._id + "'>" +
            "<td>" + course.fullname + "</td>" +
            "<td>" + course.email + "</td>" +
            "<td>" + course.phone + "</td>" +
            "<td>" + course.grade + "</td>" + 
            "<td>" + course.sex + "</td>" + 
            "<td>" + course.confirmed + "</td>" + 
          "</tr>";
      });
      $('tbody').append(courses);
      if(response[response.length - 1]) currenTr = response[response.length - 1]._id;
      else endList = true;
    }
  });
}

$(document).ready(function() {
  $('#anchor').viewportChecker({
        offset: 0,
        repeat: true,
        callbackFunction: function() {
          if (firstLoad) { 
            loadCourses("000000000000000000000000");
            firstLoad = false;
          }
          else if (!pending && !endList && !firstLoad){
           loadCourses(currenTr);
          }
        }
    });
});