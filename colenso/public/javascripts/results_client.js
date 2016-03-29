
// Replace <title> with <teititle> to prevent conflict with HTML <title>
$("body tei teiheader filedesc titlestmt title").replaceWith('<teititle>' +
 $('body tei teiheader filedesc titlestmt title').html() +'</teititle>');

$(document).ready(function(){
  $(".resultAuthorCreated").hide();
  $(".resultWordCount").hide();
  $(".resultContext").hide();
  $(".resultsCount").hide();
  $(".searchTerm").hide();

});

$("#resultType").click(function(){
  $(".resultAuthorCreated").toggle();
  $(".resultWordCount").toggle();
  $(".resultContext").toggle();
  $(".resultsCount").toggle();
  $(".searchTerm").toggle();

  if ($("#resultType").text() === "Simple"){
    $("#resultType").text("Advanced");
  } else {
    $("#resultType").text("Simple");
  }

});
