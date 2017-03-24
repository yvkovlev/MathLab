$(document).ready(function() {
  $("#submit").on("click", function(){
    $.ajax({
      url: 'api/login',
      method: 'post',
      data: {login: $('#login').val(), password: $('#password').val()},
      success: function(response){
        if (response == 'Fail') {
          alert("Неверный логин или пароль!");
        }
        else {
          alert();
          window.location.href = "/cabinet/" + response;
        }
      }
    });
  });
});