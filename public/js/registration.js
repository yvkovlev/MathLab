$(document).ready(function() {
  $("#submit-1").on("click", function(){
    if (!($("#submit-1").hasClass('disabled'))) {
      realHeight();
      $("#form-1").hide();
      $(".loader").show();
      setTimeout(function() {
        $(".loader").hide();
        $("#form-2").show();
        $("#page-1").addClass("disabled-page");
        $("#page-2").removeClass("disabled-page");
        $(".forms").css({height: "auto"});
        formPaginationProgress();
      }, 500);
      return false;
    }
  });
  $("#submit-2").on("click", function(){
    //if (!($("#submit-2").hasClass('disabled'))) {
      $(".forms").css({height: "200px"});
      $("#form-2").hide();
      $(".loader").show();
      setTimeout(function() {
        $(".loader").hide();
        $("#form-3").show();
        $("#page-2").addClass("disabled-page");
        $("#page-3").removeClass("disabled-page");
        $(".forms").css({height: "auto"});
        formPaginationProgress();
      }, 500);
      return false;
   // }
  });
  $("#submit-3").on("click", function(){
    $(".forms").css({height: "200px"});
    $("#form-3").hide();
    $(".loader").show();
    setTimeout(function() {
      $(".loader").hide();
      $("#form-4").show();
      $("#page-3").addClass("disabled-page");
      $("#page-4").removeClass("disabled-page");
      $(".forms").css({height: "auto"});
      formPaginationProgress();
    }, 500);
    return false;
  })
})

function realHeight() {
  var realHeight = $(".forms").height();
  $(".forms").height(realHeight);
  return realHeight;
}

function formPaginationProgress() {
  $(".form-pagination-progress").animate({width: "+=25%"}, 200);
}
