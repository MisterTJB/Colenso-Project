
$("#basicSearch").on('click', function(){
  $("#helpText").replaceWith('<div class="col-xs-8 col-xs-offset-2" id="helpText"><p>Basic help</p></div>');
});

$("#advancedSearch").on('click', function(){
  $("#helpText").replaceWith('<div class="col-xs-8 col-xs-offset-2" id="helpText"><p>Advanced help</p></div>');
});
