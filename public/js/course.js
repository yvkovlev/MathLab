var dialogId = (window.location.href).split('/')[4];
var dialogInfo;
var userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
var socket = io();
var pending = true;
var firstLoad = true;
var endList = false;
var currenTr;

function loadMessages(lastId) {
  $.ajax({
    url: '/api/loadMessages',
    method: 'post',
    data: {dialogId: dialogId, lastId: lastId},
    beforeSend: function() {
      pending = true;
    },
    success: function(response) {
      pending = false;
      var messages = "";
      response.forEach(function(message, response){
        if (message.senderId != $(".message:last-child").attr("id")) {
          messages +=
            "<div class='message' id='" + message._id + "'>" +
              "<div class='message-img'>" +
                "<img src='/uploads/" + message.senderId + ".jpg' class='img-circle'>" +
              "</div>" +
              "<div class='message-body'>" +
                "<h5>" + message.sender + "</h5>";
        if (message.fileUrl) {
          messages +=
            "<div class='message-attachment'>" +
              "<div class='message-attachment-img'>" +
                "<a href='" + message.fileUrl + "' class='btn btn-primary' role='button'><i class='fa fa-paperclip' aria-hidden='true'></i></a>" +
              "</div>" +
              "<div class='message-attachment-body'>" +
                  "<h5>" + (message.fileUrl).split('/')[(message.fileUrl).split('/').length - 1] + "</h5>" +
                "<h6>" + (message.fileSize / 1024).toFixed(2) + " КБ</h6>" +
              "</div>" +
            "</div>";
        }
          messages +=
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
      $('.messages').prepend(messages);
      if (response[response.length - 1]) currenTr = response[0]._id;
      else endList = true;
      $(".nano").nanoScroller({ 
        scroll: 'bottom' 
      });
    }
  });
}

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
      $(document).prop('title', dialogInfo.subject + " (" + dialogInfo.teacher + ")");
    }
  });

  $('#anchor').viewportChecker({
    offset: 0,
    repeat: true,
    callbackFunction: function() {
      if (firstLoad) { 
        loadMessages("000000000000000000000000");
        firstLoad = false;
      }
      else if (!pending && !endList && !firstLoad){
        loadMessages(currenTr);
      }
    }
  });



  socket.on('newMessage', function(response){
    console.log(response);
    var message = "";
    message += 
      "<div class='message' id='" + response.senderId + "'>" +
        "<div class='message-img'>" +
          "<img src='/uploads/" + response.senderId + ".jpg' class='img-circle'>" +
        "</div>" +
        "<div class='message-body'>" +
          "<h5>" + response.sender + "</h5>";
    if (response.fileUrl) {
      message +=
        "<div class='message-attachment'>" +
          "<div class='message-attachment-img'>" +
            "<a href='" + response.fileUrl + "' class='btn btn-primary' role='button'><i class='fa fa-paperclip' aria-hidden='true'></i></a>" +
          "</div>" +
          "<div class='message-attachment-body'>" +
              "<h5>" + (response.fileUrl).split('/')[(response.fileUrl).split('/').length - 1] + "</h5>" +
            "<h6>" + (response.fileSize / 1024).toFixed(2) + " КБ</h6>" +
          "</div>" +
        "</div>";
    }
    message +=
          "<ul>" +
            "<li>" + response.message + "</li>" +
          "</ul>" +
        "</div>" +
        "<div class='message-date'>" +
          "<span>" + moment(response.date).format("HH:mm") + "</span>" +
        "</div>" +
      "</div>";
    $('.messages').append(message);
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
    if ($('.message-input').html() == "" || $('.message-input').html() == "<br>") {
      $('.message-input').html("");
      $(".message-input").css("height", "40px");
    }
  });
});

function sendMessage() {
  var file = $('#attachment').prop('files')[0];
  var formData = new FormData();
  formData.append('file', file);
  formData.append('dialogId', dialogId);
  formData.append('message', $('.message-input').html());
  $.ajax({
    url: '/api/sendMessage',
    method: 'post',
    data: formData,
    processData: false,
    contentType: false,
    success: function(response){
      socket.emit('sendMessage', response);
      var message = "";
      message += 
        "<div class='message' id='" + response.senderId + "'>" +
          "<div class='message-img'>" +
            "<img src='/uploads/" + response.senderId + ".jpg' class='img-circle'>" +
          "</div>" +
          "<div class='message-body'>" +
            "<h5>" + response.sender + "</h5>";
      if (response.fileUrl) {
        message +=
          "<div class='message-attachment'>" +
            "<div class='message-attachment-img'>" +
              "<a href='" + response.fileUrl + "' class='btn btn-primary' role='button'><i class='fa fa-paperclip' aria-hidden='true'></i></a>" +
            "</div>" +
            "<div class='message-attachment-body'>" +
                "<h5>" + (response.fileUrl).split('/')[(response.fileUrl).split('/').length - 1] + "</h5>" +
              "<h6>" + (response.fileSize / 1024).toFixed(2) + " КБ</h6>" +
            "</div>" +
          "</div>";
      }
      message +=
            "<ul>" +
              "<li>" + response.message + "</li>" +
            "</ul>" +
          "</div>" +
          "<div class='message-date'>" +
            "<span>" + moment(response.date).format("HH:mm") + "</span>" +
          "</div>" +
        "</div>";
      $('.messages').append(message);
      $('.message-input').html("");
      $('.attachments-block').html("");
      $(".panel-body").css("height", "600px");
      $(".nano").nanoScroller();
      $(".nano").nanoScroller({ 
        scroll: 'bottom' 
      });
    }
  });
};

