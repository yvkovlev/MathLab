var dialogId = (window.location.href).split('/')[4];
var dialogInfo;
var userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
var socket = io();

$(document).ready(function() {
  var rows = 1;
  socket.emit('setRooms', userInfo.id);
  $.ajax({
    url: '/api/courseInfo',
    method: 'post',
    data: {dialogId: dialogId},
    success: function(response) {
      dialogInfo = response;
      console.log(response);
      $(".panel-heading .col-sm-6").html((dialogInfo.studentId != userInfo.id) ? ("<img src='/uploads/" + dialogInfo.studentId + ".jpg' class='img-circle'> " + dialogInfo.student) : ("<img src='/uploads/" + dialogInfo.teacherId + ".jpg' class='img-circle'> " + dialogInfo.teacher));
      $(".panel-heading .text-right").html(dialogInfo.subject);
    }
  });
  $.ajax({
    url: '/api/loadMessages',
    method: 'post',
    data: {dialogId: dialogId},
    success: function(response) {
      var messages = "";
      response.forEach(function(message, response){
        if (message.senderId != $(".message:last-child").attr("id")) {
          messages +=
            "<div class='message' id='" + message.senderId + "'>" +
              "<div class='message-img'>" +
                "<img src='/uploads/" + message.senderId + ".jpg' class='img-circle'>" +
              "</div>" +
              "<div class='message-body'>" +
                "<h5>" + message.sender + "</h5>" +
                "<ul>" +
                  "<li>" + message.message + "</li>" +
                "</ul>" +
              "</div>" +
              "<div class='message-date'>" +
                "<span>" + moment(message.date).format("HH:mm") + "</span>" +
              "</div>" +
            "</div>";
        }
      });
      $('.messages').append(messages);
      $(".nano").nanoScroller({ 
        scroll: 'bottom' 
      });
    }
  });
  socket.on('newMessage', function(message){
    $('.messages').append(
        "<div class='message message-out'>" +
              "<div class='message-img'>" +
                "<img src='/uploads/" + message.senderId + ".jpg' class='img-circle'>" +
              "</div>" +
              "<div class='message-body'>" +
                "<h5>" + message.sender + "</h5>" +
                "<ul>" +
                  "<li>" + message.message + "</li>" +
                "</ul>" +
              "</div>" +
              "<div class='message-date'>" +
                "<span>" + moment(message.date).format("HH:mm") + "</span>" +
              "</div>" +
            "</div>");
    $(".nano").nanoScroller();
    $(".nano").nanoScroller({ 
      scroll: 'bottom' 
    });
  });
  $(".send-button").on('click', function(){
    sendMessage();
  });
  $(".message-input").on("focusin", function(){
    if (!$(".message-input").html()) {
      $(".placeholder").addClass("hidden");
    }
  });
  $(".message-input").on("focusout", function(){
    if (!$(".message-input").html()) {
      $(".placeholder").removeClass("hidden");
    }
  });
  $(".message-input").keypress(function(e){
      if(e.keyCode == 13 && e.shiftKey){
        if (rows <= 2) {
          $(".message-input").css("height", "+=20");
          rows++;
        }
        if (rows > 2 && rows <= 7) {
          $(".message-input").css("height", "+=20");
          $(".panel-body").css("height", "-=20");
          rows++;
        }
      }
      else if (e.keyCode == 13) {
        sendMessage();
        e.preventDefault();
      }
  });
  $(".message-input").keyup(function(e){
    console.log($('.message-input').html());
    if ($('.message-input').html() == "" || $('.message-input').html() == "<br>") {
      $('.message-input').html("");
      $(".message-input").css("height", "40px");
    }
  });
});

function sendMessage() {
  $.ajax({
    url: '/api/sendMessage',
    method: 'put',
    data: {dialogId: dialogId, message: $('.message-input').html()},
    success: function(response){
      socket.emit('sendMessage', {dialogId: dialogId, sender: userInfo.fullname, senderId: userInfo.id, message: $('.message-input').html()});
      $('.messages').append(
      "<div class='message message-out'>" +
            "<div class='message-img'>" +
              "<img src='/uploads/" + userInfo.id + ".jpg' class='img-circle'>" +
            "</div>" +
            "<div class='message-body'>" +
              "<h5>" + userInfo.fullname + "</h5>" +
              "<ul>" +
                "<li>" + $('.message-input').html() + "</li>" +
              "</ul>" +
            "</div>" +
            "<div class='message-date'>" +
                "<span>" + moment().format("HH:mm") + "</span>" +
              "</div>" +
          "</div>");
      $('.message-input').html("");
      $(".panel-body").css("height", "600px");
      $(".nano").nanoScroller();
      $(".nano").nanoScroller({ 
        scroll: 'bottom' 
      });
    }
  });
};

