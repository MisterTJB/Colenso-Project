

// Replace <title> with <teititle> to prevent conflict with HTML <title>
$("#xmlData tei teiheader filedesc titlestmt title").replaceWith('<teititle>' +
 $('#xmlData tei teiheader filedesc titlestmt title').html() +'</teititle>');

$(document).ready(function(){
  $("#textData").hide();
  $("#save").hide();
  $("#cancel").hide();
  $("#validation").hide();
  $("#saveButton").prop('disabled', true);
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
