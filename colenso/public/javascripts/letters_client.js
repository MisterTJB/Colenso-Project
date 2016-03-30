

// Replace <title> with <teititle> to prevent conflict with HTML <title>
$("#xmlData tei teiheader filedesc titlestmt title").replaceWith('<teititle>' +
 $('#xmlData tei teiheader filedesc titlestmt title').html() +'</teititle>');

 // Replace <text> with <teitext> to prevent conflict with HTML <title>
 $("#xmlData tei text").replaceWith('<teitext>' +
  $('#xmlData tei text').html() +'</teitext>');

$(document).ready(function(){
  $("#textData").hide();
  $("#save").hide();
  $("#cancel").hide();
  $("#validation").hide();
  $("#saveButton").prop('disabled', true);
  $("teiheader").after("<hr>");
  setNextAndPreviousLetter();
});

$("#edit").on('click', function(event){
  $("#textData").toggle();
  $("#xmlData").toggle();
  $("#save").show()
  $("#cancel").show();

  if ($("#edit").text() === "Edit"){
    $("#edit").text("View");
  } else {
    $("#edit").text("Edit");
  }
});

$("#teiTextArea").on('input',function(e){
  console.log("text input fired");
  $("#saveButton").prop('disabled', true);
  $("#validation").empty();
  var textData = $("#teiTextArea").val()
  var htmlFromText = $.parseHTML(textData);
  $("#xmlData").empty();
  $(textData).appendTo("#xmlData");
  $("#xmlData tei teiheader filedesc titlestmt title").replaceWith('<teititle>' +
   $('#xmlData tei teiheader filedesc titlestmt title').html() +'</teititle>');
   $("#xmlData tei text").replaceWith('<teitext>' +
    $('#xmlData tei text').html() +'</teitext>');
});

$("#validate").on('click', function(e){
  $("#validation").hide();
  $("#saveButton").prop('disabled', false);
  var data = {'xml': $("#teiTextArea").val().replace(/\n/g,'')};
  $.post("/validate", data, function(response){
    console.log(response);
    $("#validation").empty();
    $("#validation").append(response);
    $("#validation").show();

    if (response === "Validates") {
      $("#saveButton").prop('disabled', false);
    }

  });
});

function uriToLetterID(uri){
  var id = uri.split("/")[uri.split("/").length - 1].split(".")[0];
  return id;
}

$("#deleteModalButton").click(function(){
  $.get(window.location.href + "/delete");
})

function urisToDocumentIDs(uris){
  var retVal = [];
  for (var i=0; i < uris.length; i++){
    retVal.push(uriToLetterID(uris[i]));
  }
  return retVal;
}

function setNextAndPreviousLetter(){
  var currentLetterID = window.location.href.split("/")[window.location.href.split("/").length - 1];

  var lettersInResultsetURIs = JSON.parse(sessionStorage.getItem("searchResults"));
  var lettersInResultsetIDs = urisToDocumentIDs(lettersInResultsetURIs);
  var currentLetterArrayPosition = lettersInResultsetIDs.indexOf(currentLetterID);

  var nextIndex = Math.min(lettersInResultsetIDs.length - 1, currentLetterArrayPosition + 1);
  var prevIndex = Math.max(0, currentLetterArrayPosition - 1);

  var nextLetterID = lettersInResultsetIDs[nextIndex];
  var previousLetterID = lettersInResultsetIDs[prevIndex];
  setNextLetter(nextLetterID);
  setPreviousLetter(previousLetterID);
}

function setNextLetter(nextLetterID){
  var currentLetterID = window.location.href.split("/")[window.location.href.split("/").length - 1];
  if (currentLetterID === nextLetterID) {
    $("#nextLetter").toggleClass("not-active")
  } else {
    $("#nextLetter").attr("href", "/letters/" + nextLetterID);
  }
}

function setPreviousLetter(previousLetterID){
  var currentLetterID = window.location.href.split("/")[window.location.href.split("/").length - 1];
  if (currentLetterID === previousLetterID) {
    $("#previousLetter").toggleClass("not-active");
  } else {
    $("#previousLetter").attr("href", "/letters/" + previousLetterID);
  }
}
