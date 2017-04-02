$(document).ready(function() { 
  $("#reg-teacher").on('click', function(){
    $.ajax({
      url: 'api/reg-teacher',
      type: 'put',
      data: {fullname: $('#fullname').val(), email: $('#email').val(), password: $('#password').val(), phone: $('#tel').val(), sex: $('#sex option:selected').text(), subject: $('#subject option:selected').text()},
      success: function(response){
        alert(response);
      }
    });
  });
});