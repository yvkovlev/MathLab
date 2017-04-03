var pending = true;
var firstLoad = true;
var endList = false;
var currenTr = $("tbody tr:last-child").attr('id');
function loadBids(lastID) {
  $.ajax({
    url: 'api/loadBids',
    method: 'post',
    data: {lastID: lastID},
    beforeSend: function() {
      pending = true;
    },
    success: function(response) {
      var bids = "";
      pending = false;
      response.forEach(function(bid, response){
        bids +=
          "<tr class='even pointer currenTr' id='" + bid._id + "'>" +
            "<td>" + bid.student + "</td>" +
            "<td>" + moment(bid.date).format('DD.MM.YY, hh.mm') + "</td>" +
            "<td>" + bid.subject + "</td>" +
            "<td>" + bid.prefDays + "</td>" +
            "<td>" + bid.prefTime + "</td>" +
            "<td>" + bid.phone + "</td>" +
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
      $('tbody').append(bids);
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