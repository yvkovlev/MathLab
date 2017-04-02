$(document).ready(function() { 
  /*$.ajax({
    url: 'mathlab.kz/api/userInfo',
    method: 'post',
    success: function(response){
      console.log(response);
    }
  });*/
  $("#log-out").on("click", function(){
    $.ajax({
      url: '/api/log-out',
      method: 'post'
    });
  });
});

$(document).ready(function() {
    $('.anchor').viewportChecker({
        offset: 100
        callbackFunction: function (){}
    });
});