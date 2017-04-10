$(document).ready(function() {
  var userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
  $('#login').attr('placeholder', userInfo.fullname);
  $('#email').attr('placeholder', userInfo.email);
  $('#phone').attr('data-number', userInfo.phone);

  $('#save-settings').on('click', function(){
    if ($('#login').val() || $('#phone').val() != "+7 " || userInfo.grade != $('#grade1 option:selected').text()) {
      $.ajax({
        url: 'api/changeSettings',
        method: 'post',
        data: {
          newLogin: ($('#login').val()) ? $('#login').val() : userInfo.fullname, 
          newPhone: ($('#phone').val()) ? $('#phone').val() : userInfo.phone, 
          newGrade: $('#grade1 option:selected').text()
        },
        success: function(response){
          sessionStorage.clear();
          window.location.href = "/cabinet/" + response;
        }
      });
    }
  });

  $('#submit-1').on('click', function(){
    $.ajax({
      url: 'api/changePassword',
      method: 'post',
      data: {oldPassword: $('#old-password').val(), newPassword: $('#new-password').val()},
      success: function(response){
        alert(response);
      }
    });
  });

  $('.kv-avatar').on('click', '.fileinput-upload-button', function(){
    alert();
    var file = $('#avatar').prop('files')[0];
    if (file)
    {
      var formData = new FormData();
      formData.append('file', file);
      console.log(formData);
      $.ajax({
        url: 'api/uploadImg',
        method: 'post',
        data: formData,
          processData: false,
          contentType: false,
          success: function(response){
              alert(response);
          }
      });
    }
  });

  $("#avatar").fileinput({
    overwriteInitial: true,
    maxFileSize: 1500,
    showClose: false,
    showCaption: false,
    browseLabel: 'Выбрать...',
    removeLabel: 'Удалить',
    uploadLabel: 'Загрузить',
    browseIcon: '<i class="fa fa-folder-open" aria-hidden="true"></i>',
    removeIcon: '<i class="fa fa-close" aria-hidden="true"></i>',
    uploadIcon: '<i class="fa fa-upload" aria-hidden="true"></i>',
    browseClass: 'btn btn-default',
    removeTitle: 'Отменить',
    elErrorContainer: '#kv-avatar-errors-1',
    msgErrorClass: 'alert alert-block alert-danger',
    defaultPreviewContent: (!userInfo.avatarUrl) ? ('<img src="/images/profile.svg" alt="Ваш аватар" style="width:160px">') : ('<img src="' + userInfo.avatarUrl + '" alt="Ваш аватар" style="width:160px">'),
    layoutTemplates: {main2: '{preview} ' + '<div class="btn-group">' + '{browse} {remove} {upload}' + '</div>'},
    allowedFileExtensions: ["jpg", "jpeg", "png"]
  });
});