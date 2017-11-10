$(document).ready(function() {
  var triggerSearch = false;
  var moveButtons = true;
  //Search button click listener
  $("#searchButton").click(function() {
    $("#search").autocomplete("close");
    main();
  });
  //Enter button listener
  $("#search").keypress(function(e) {
    if (e.which === 13) {
      main();
    }
  });
  $("#search").keyup(function(e) {
    if (e.which !== 13) {
      triggerSearch = true;
      searchWiki();
    }
  });

  //Set up top bar
  function main() {
    $("#imageGlobe").slideUp();
    $("#wrapper").addClass("left", 400);
    $("#wrapper").removeClass("center", 400);
    $("#wrapper").animate({
      borderColor: "#333"
    }, 500);
    triggerSearch = false;
    moveButtons = false;
    $("#buttonDiv").removeClass("lower");
    searchWiki();
  }
  //Search Wikipedia
  function searchWiki() {
    var searchItem = $("#search").val();
    $.ajax({
      type: "GET",
      url:
        "https://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=" +
        searchItem,
      asynce: false,
      dataType: "jsonp",
      success: function(val) {
        if (triggerSearch !== true) {
          displayResults(val);
        } else {
          displaySearch(val);
        }
      },
      error: displayError
    });
  }
  //Display search results
  function displayResults(val) {
    $("#datalist").empty();
    $("#results").empty();
    for (var i = 0; i < val[1].length; i++) {
      $("#results")
        .hide()
        .append(
          "<div class=wikiResults><h4 class='heading'><a href=" +
            val[3][i] +
            " target='_blank'>" +
            val[1][i] +
            "</a></h4><hr><p class'description'>" +
            val[2][i] +
            "</p>"
        )
        .delay(400)
        .fadeIn();
    }
  }
  //Display autocomplete 
  function displaySearch(val) {
    $("#search").autocomplete({
      source: function(request, response) {
        $.ajax({
          url: "https://en.wikipedia.org/w/api.php",
          dataType: "jsonp",
          data: {
            action: "opensearch",
            format: "json",
            limit: 5,
            search: request.term
          },
          success: function(val) {
            response(val[1]);
          }
        });
      },
      select: function(e, ui) {
        $("#buttonDiv").removeClass("lower");
      }
    });
    if (moveButtons === true) {
      $("#buttonDiv").addClass("lower");
    }
    if ($("#search").val() === "") {
      $("#buttonDiv").removeClass("lower");
    }
    $("#search").keypress(function(e) {
      if (e.which === 13) {
      $("#search").autocomplete("close");
    }
  });
  }
  //Display error message
  function displayError() {
    $("#results").append("<div>We could not find any matches</div>");
  }
});