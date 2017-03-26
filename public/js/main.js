function setUserInfo(userInfo) {
  $('#fullname').html(userInfo.fullname);
  $('#email').html(userInfo.email);
  $('#phone').html(userInfo.phone);
}

$(document).ready(function() { 
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
});