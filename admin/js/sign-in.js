$(document).ready(function() {
  $("#submit").on("click", function(){
    $.ajax({
      url: 'api/login',
      method: 'post',
      data: {login: 'ter@mail.ru'/*$('#login').val()*/, password: '123123'/*$('#password').val()*/},
      success: function(response){
        console.log(response);
        if (response == 'Fail') {
          /*$(".error-alerts").html("<div class='alert alert-danger alert-dismissable'>" +
                                      "<strong>Ошибка!</strong> Неверный e-mail или пароль." +
                                    "</div>");*/
          alert();
        }
        else {
          window.location.href = "/";
        }
      }
    });
  });
});