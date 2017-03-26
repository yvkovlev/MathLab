$(document).ready(function() {
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

})