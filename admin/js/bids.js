var pending = true;
var firstLoad = true;
var endList = false;
var currenTr = $(".tbody-bids tr:last-child").attr('id');
function loadBids(lastID) {
  $.ajax({
    url: 'api/loadBids',
    method: 'post',
    data: {lastID: lastID},
    beforeSend: function() {
      pending = true;
    },
    success: function(response) {
      console.log(response);
      var bids = "";
      pending = false;
      response.forEach(function(bid, response){
        bids +=
          "<tr class='even pointer currenTr' id='" + bid._id + "'>" +
            "<td class='bid-student'>" + bid.student + "</td>" +
            "<td class='bid-date'>" + moment(bid.date).format('DD.MM.YY, hh.mm') + "</td>" +
            "<td class='bid-subject'>" + bid.subject + "</td>" +
            "<td class='bid-prefDays'>" + bid.prefDays + "</td>" +
            "<td class='bid-prefTime'>" + bid.prefTime + "</td>" +
            "<td class='bid-phone'>" + bid.phone + "</td>" +
            "<td class='last'>" +
              "<div class='dropup'>" +
                "<button class='btn btn-xs btn-primary dropdown-toggle' type='button' data-toggle='dropdown'>На рассмотрении <span class='caret'></span></button>" +
                "<ul class='dropdown-menu'>" +
                  "<li><a href='#'>Подтверждено</a></li>" +
                  "<li><a href='#'>Отказано</a></li>" +
                "</ul>" +
              "</div>" +
            "</td>" +
          "</tr>";
      });
      $('.tbody-bids').append(bids);
      if(response[response.length - 1]) currenTr = response[response.length - 1]._id;
      else endList = true;
    }
  });
}

$(document).ready(function() {
  if (firstLoad) { 
    loadBids("000000000000000000000000");
    firstLoad = false;
  }
  if (!firstLoad) {
    $('#anchor').viewportChecker({
        offset: 0,
        repeat: true,
        callbackFunction: function() {
        	if (!pending && !endList) loadBids(currenTr);
        }
    });
  }
});

$(document).ready(function() {
  $(".tbody-bids").on("click", ".currenTr", function(){
    var student = $(this).find(".bid-student").first().html();
    var subject = $(this).find(".bid-subject").first().html();
    var prefDays = $(this).find(".bid-prefDays").first().html();
    var prefTime = $(this).find(".bid-prefTime").first().html();
    $("#student").html(student);
    $("#subject").html(subject);
    $("#prefDays").html(prefDays);
    $("#prefTime").html(prefTime);
    $("#courseAddingModal").modal({show: true});
  })
});