var pending = true;
var firstLoad = true;
var endList = false;
var currenTr = $(".tbody-bids tr:last-child").attr('id');
function loadBids(lastID) {
  $.ajax({
    url: 'api/loadBids',
    method: 'post',
    data: {lastID: lastID},
    beforeSend: function() {
      pending = true;
    },
    success: function(response) {
      var bids = "";
      pending = false;
      response.forEach(function(bid, response){
        bids +=
          "<tr class='even pointer currenTr' id='" + bid._id + "'>" +
            "<td class='bid-student' id='" + bid.studentId + "'>" + bid.student + "</td>" +
            "<td class='bid-date'>" + moment(bid.date).format('DD.MM.YY, hh.mm') + "</td>" +
            "<td class='bid-subject'>" + bid.subject + "</td>" +
            "<td class='bid-prefDays'>" + bid.prefDays + "</td>" +
            "<td class='bid-prefTime'>" + bid.prefTime + "</td>" +
            "<td class='bid-phone'>" + bid.phone + "</td>" +
            "<td class='last'>" +
              "<div class='dropup'>" +
                "<button class='btn btn-xs btn-primary dropdown-toggle' type='button' data-toggle='dropdown'>На рассмотрении <span class='caret'></span></button>" +
                "<ul class='dropdown-menu'>" +
                  "<li><a href='#'>Подтверждено</a></li>" +
                  "<li><a href='#'>Отказано</a></li>" +
                "</ul>" +
              "</div>" +
            "</td>" +
          "</tr>";
      });
      $('.tbody-bids').append(bids);
      if(response[response.length - 1]) currenTr = response[response.length - 1]._id;
      else endList = true;
    }
  });
}

$(document).ready(function() {
  $.ajax({
    url: 'api/teachers',
    method: 'get',
    success: function(response){
      var teacherList = "";
      response.forEach(function(item, response){
        teacherList +=
          "<option id='" + item._id + "'>" + item.fullname + "</option>";
      });
      $('#teacher-list').append(teacherList);
    }
  });
  if (firstLoad) { 
    loadBids("000000000000000000000000");
    firstLoad = false;
  }
  if (!firstLoad) {
    $('#anchor').viewportChecker({
        offset: 0,
        repeat: true,
        callbackFunction: function() {
        	if (!pending && !endList) loadBids(currenTr);
        }
    });
  }
});

$(document).ready(function() {
  var student, subject, prefDays, prefTime, id, studentId;
  $(".tbody-bids").on("click", ".currenTr", function(){
    student = $(this).find(".bid-student").first().html();
    subject = $(this).find(".bid-subject").first().html();
    prefDays = $(this).find(".bid-prefDays").first().html();
    prefTime = $(this).find(".bid-prefTime").first().html();
    studentId = $(this).find(".bid-student").first().attr('id');
    id = $(this).attr('id');
    $("#student").html(student);
    $("#subject").html(subject);
    $("#prefDays").html(prefDays);
    $("#prefTime").html(prefTime);
    $("#courseAddingModal").modal({show: true});
  });
  $("#create-course").on('click', function(){
    var prefDaysFinally = "";
    if ($('#monday')[0].checked) prefDaysFinally += "Пн ";
    if ($('#tuesday')[0].checked) prefDaysFinally += "Вт ";
    if ($('#wednesday')[0].checked) prefDaysFinally += "Ср ";
    if ($('#thursday')[0].checked) prefDaysFinally += "Чт ";
    if ($('#friday')[0].checked) prefDaysFinally += "Пт ";
    if ($('#saturday')[0].checked) prefDaysFinally += "Сб ";
    if ($('#sunday')[0].checked) prefDaysFinally += "Вс ";
    $.ajax({
      url: 'api/createCourse',
      method: 'put',
      data: {id: id, studentId: studentId, student: student, subject: subject, teacherId: $('#teacher-list option:selected').attr('id'), teacher: $('#teacher-list option:selected').text(), days: prefDaysFinally, time: $("#time").val()},
      success: function(response){
        if (response == 'Success') {
          $("#courseAddingModal").modal('hide');
          $(".abs-alerts").html("<div class='alert alert-success'>" +
                                  "<strong>Готово!</strong> Курс установлен!" +
                                "</div>");
          setTimeout(function() { 
            $(".abs-alerts").html("");
          }, 2000);
        }
        else {
          $("#courseAddingModal").modal('hide');
          $(".abs-alerts").html("<div class='alert alert-danger'>" +
                                  "<strong>Ошибка!</strong> Попробуйте позже" +
                                "</div>");
          setTimeout(function() { 
            $(".abs-alerts").html("");
          }, 2000);
        }
      }
    });
  });
});