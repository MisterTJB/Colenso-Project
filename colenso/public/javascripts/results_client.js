
// Replace <title> with <teititle> to prevent conflict with HTML <title>
$("body tei teiheader filedesc titlestmt title").replaceWith('<teititle>' +
 $('body tei teiheader filedesc titlestmt title').html() +'</teititle>');

function buildAndSetDownloadHref(){
  console.log("About to set HREF");
  var downloadHref = "/searchFilter/download?"
  var count = 0;
  $(".search-result").filter(":visible").each(function(){
      downloadHref += count + "=" + this.id + "&";
      count += 1;
  });
  $("#download").attr("href", encodeURI(downloadHref.slice(0, downloadHref.length - 1)));

}

$(document).ready(function(){
  $(".resultAuthorCreated").hide();
  $(".resultWordCount").hide();
  $(".resultContext").hide();
  $(".resultsCount").hide();
  $(".searchTerm").hide();
  buildAndSetDownloadHref();


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


$("#searchFilterButton").click(function(){

  var resultURIs = [];
  $(".search-result").each(function(){
    resultURIs.push(this.id);
  });
  console.log(resultURIs);
  data = {
    uris: resultURIs,
    q: $("#searchFilterInput").val()
  }
  $.post("/searchFilter", data, function(response){
    var resultsHTML = $.parseHTML(response);
    $("#results").replaceWith(resultsHTML);
    var results = $(".search-result").length;
    var queryPath = $('.searchTerm').text();
    queryPath = queryPath + " > " + $("#searchFilterInput").val();
    $("#searchFilterInput").val("")
    $('.searchTerm').text(queryPath);
    $('.resultsCount').text(results);
    if ($("#resultType").text() === "Advanced"){
      $(".resultAuthorCreated").hide();
      $(".resultWordCount").hide();
      $(".resultContext").hide();
      $(".resultsCount").hide();
      $(".searchTerm").hide();
    } else {
      $(".resultAuthorCreated").show();
      $(".resultWordCount").show();
      $(".resultContext").show();
      $(".resultsCount").show();
      $(".searchTerm").show();
    }
    buildAndSetDownloadHref();
  });
});
