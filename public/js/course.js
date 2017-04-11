$(document).ready(function() {
  var socket = io();
  var dialogId = (window.location.href).split('/')[4];
  var dialogInfo;
  var userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
  socket.emit('setRooms', userInfo.id);
  $.ajax({
    url: '/api/courseInfo',
    method: 'post',
    data: {dialogId: dialogId},
    success: function(response) {
      dialogInfo = response;
    }
  });
  $.ajax({
    url: '/api/loadMessages',
    method: 'post',
    data: {dialogId: dialogId},
    success: function(response) {
      var messages = "";
      response.forEach(function(message, response){
        if (message.senderId == userInfo.id) {
          messages +=
            "<div class='message message-out'>" +
              "<div class='message-img'>" +
                "<img src='/images/profile.svg' class='img-circle'>" +
              "</div>" +
              "<div class='message-body'>" +
                "<h5>" + message.sender + "</h5>" +
                "<ul>" +
                  "<li>" + message.message + "</li>" +
                "</ul>" +
              "</div>" +
            "</div>";
        }
        else {
          messages +=
            "<div class='message message-in'>" +
              "<div class='message-img'>" +
                "<img src='/images/profile.svg' class='img-circle'>" +
              "</div>" +
              "<div class='message-body'>" +
                "<h5>" + message.sender + "</h5>" +
                "<ul>" +
                  "<li>" + message.message + "</li>" +
                "</ul>" +
              "</div>" +
            "</div>";
        }
      });
      $('.messages').append(messages);
    }
  });
  socket.on('newMessage', function(message){
    $('.messages').append(
        "<div class='message message-out'>" +
              "<div class='message-img'>" +
                "<img src='/images/profile.svg' class='img-circle'>" +
              "</div>" +
              "<div class='message-body'>" +
                "<h5>" + message.sender + "</h5>" +
                "<ul>" +
                  "<li>" + message.message + "</li>" +
                "</ul>" +
              "</div>" +
            "</div>");
  });
  $(".send-button").on('click', function(){
    $.ajax({
      url: '/api/sendMessage',
      method: 'put',
      data: {dialogId: dialogId, message: $('.message-input').html()},
      success: function(response){
        socket.emit('sendMessage', {dialogId: dialogId, sender: userInfo.fullname, senderId: userInfo.id, message: $('.message-input').html()});
        $('.messages').append(
        "<div class='message message-out'>" +
              "<div class='message-img'>" +
                "<img src='/images/profile.svg' class='img-circle'>" +
              "</div>" +
              "<div class='message-body'>" +
                "<h5>" + userInfo.fullname + "</h5>" +
                "<ul>" +
                  "<li>" + $('.message-input').html() + "</li>" +
                "</ul>" +
              "</div>" +
            "</div>");
        $('.message-input').html("");
      }
    });
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
  $(".nano").nanoScroller({ 
    disableResize: true,
    scroll: 'bottom' 
  });
});