function setUserInfo(userInfo) {
  $('#fullname').html(userInfo.fullname);
  $('#email').html(userInfo.email);
  $('#phone').html(userInfo.phone);
  $('#grade').html(userInfo.grade);
  $('.profile-img img').attr('src', userInfo.avatarUrl);
}

$(document).ready(function() { 
  var socket = io();
  var userInfo = new Object();
  if (!sessionStorage.getItem("userInfo") || typeof(window.sessionStorage) === "undefined") {
    $.ajax({
      url: '/api/userInfo',
      method: 'post',
      success: function(response){
        sessionStorage.setItem("userInfo", JSON.stringify(response));
        setUserInfo(response);
      }
    });
  }
  else setUserInfo(JSON.parse(sessionStorage.getItem("userInfo")));
  socket.emit('setRooms', JSON.parse(sessionStorage.getItem("userInfo")).id);
  $("#log-out").on("click", function(){
    sessionStorage.clear();
    $.ajax({
      url: '/api/log-out',
      method: 'post'
    });
  });
  $.ajax({
    url: '/api/loadStudentCourses',
    method: 'get',
    success: function(response) {
      var courses = "<tr>", cnt = 0, len = 0, siz = response.length;
      response.forEach(function(item, response){
        courses += 
          "<td id='" + item._id + "''>" +
            "<div class='course active-course'>" +
              "<div class='course-header'>" +
                "<div class='course-info-img'>" +
                  "<img src='/images/teacher.svg' class='img-circle'>" +
                "</div>" +
                "<div class='course-info-titles'>" + 
                  "<h5>" + item.teacher + "</h5>" +
                  "<h6>" + item.subject + " <small>" + item.endingTime + "</small></h6>" +
                "</div>" +
              "</div>" +
            "</div>" +
          "</td>";
        cnt++;
        len++;
        if (cnt == 2 && len != siz) {
          courses += "</tr><tr>";
          cnt = 0;
        }
      });
      courses += "</tr>";
      $('tbody').append(courses);
    }
  });
  $("#req-submit").on("click", function(){
    var prefDays = "";
    if ($('#monday')[0].checked) prefDays += "Пн ";
    if ($('#tuesday')[0].checked) prefDays += "Вт ";
    if ($('#wednesday')[0].checked) prefDays += "Ср ";
    if ($('#thursday')[0].checked) prefDays += "Чт ";
    if ($('#friday')[0].checked) prefDays += "Пт ";
    if ($('#saturday')[0].checked) prefDays += "Сб ";
    if ($('#sunday')[0].checked) prefDays += "Вс ";
    $.ajax({
      url: "api/putBid",
      method: "put",
      data: {subject: $('#subject option:selected').text(), prefDays: prefDays, prefTime: $(".bfh-timepicker input").val()},
      beforeLoad: function(){
        $(".modal-body").html("<img src='images/loading.svg'>");
      },
      success: function(response) {
        if (response == "Success") {
          $("#requestModal").modal('hide');
          $("#succesModal").modal({show: true});
        }
        else {
          $(".modal-body").append("<div class='alert alert-danger'>" +
                                    "<strong>Произошла ошибка!</strong> Попробуйте позже.</a>." +
                                  "</div>")
        }
      }
    });
  });
});