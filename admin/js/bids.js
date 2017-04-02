function loadTeachers(lastID) {
  $.ajax({
    url: 'api/loadBids',
    method: 'post',
    data: {lastID: lastID},
    success: function(response) {
      var bids = "";
      response.forEach(function(bid, response){
        bids +=
          "<tr class='even pointer' id='" + bid._id + "'>" +
            "<td>" + bid.student + "</td>" +
            "<td>18.04.2017 20:45</td>" +
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
    }
  });
}

$(document).ready(function() {
    $('#anchor').viewportChecker({
        offset: 0,
        callbackFunction: function() {
        	if (!$('tbody tr').length) loadTeachers("000000000000000000000000");
          else loadTeachers($("tbody tr:last-child").attr('id'));
        }
    });
});