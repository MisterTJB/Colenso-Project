
$("#basicSearch").on('click', function(){
  $("#helpText").replaceWith(`<div class="col-xs-8 col-xs-offset-2" id="helpText">
  <p>A basic search allows you to perform full text searches using AND, OR and NOT operators</p></div>`);
});

$("#advancedSearch").on('click', function(){
  $("#helpText").replaceWith(`<div class="col-xs-8 col-xs-offset-2" id="helpText"><p>Advanced searching allows you to use XPath selectors to 
  search on specific document elements</p></div>`);
});
