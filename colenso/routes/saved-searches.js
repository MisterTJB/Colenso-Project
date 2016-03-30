var express = require('express');
var router = express.Router();
var basex = require('basex');
var client = new basex.Session("127.0.0.1", 1984, "admin", "admin");

var searchGroupsQuery = `
XQUERY declare default element namespace 'http://www.tei-c.org/ns/1.0';
json:serialize(

<results>{
for $name in distinct-values(fn:collection("Colenso")//search_group/@name)
return (fn:collection("Colenso")//search_group[@name = $name])[1]
}</results>, map{'format': 'jsonml'})`

function formatResults(parsedResults){
  var unpackedResults = [];
  for (var i=0; i < parsedResults.length; i++){
    var result = parsedResults[i][1];
    unpackedResults.push(result)
  }
  return unpackedResults;
}

/* GET home page. */
router.get('/', function(req, res, next) {

  client.execute(searchGroupsQuery, function(error, result){
    if (!error) {
      var parsedResults = JSON.parse(result.result).slice(2);
      var unpackedResults = formatResults(parsedResults);
      console.log(unpackedResults);
      res.render('saved-searches', {searches: unpackedResults});
    } else {
      console.log(error);
    }
  });

});

module.exports = router;
