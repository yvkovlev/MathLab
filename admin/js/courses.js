var pending = true;
var firstLoad = true;
var endList = false;
var currenTr;


function loadCourses(lastID) {
  $.ajax({
    url: '/api/loadCourses',
    method: 'post',
    data: {lastID: lastID},
    beforeSend: function() {
      pending = true;
    },
    success: function(response) {
      console.log(response);
      var courses = "";
      pending = false;
      response.forEach(function(course, response){
        courses += 
          "<tr id='" + course._id + "'>" +
            "<td>" + course.subject + "</td>" +
            "<td>" + course.student + "</td>" +
            "<td>" + course.teacher + "</td>" +
            "<td>" + course.time + "</td>" + 
            "<td>" + course.date + "</td>" + 
            "<td>" + course.endingTime + "</td>" + 
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