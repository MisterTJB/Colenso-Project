var express = require('express');
var router = express.Router();

var basex = require('basex');
var client = new basex.Session("127.0.0.1", 1984, "admin", "admin");

var namespace = "XQUERY declare default element namespace 'http://www.tei-c.org/ns/1.0';";

function formatResults(parsedResults){
  var formattedResults = [];
  for (var i=0; i < parsedResults.length; i++){
    var result = parsedResults[i][1];
    var uriComponents = result.uri.split("/");
    var documentIdentifier = uriComponents[uriComponents.length - 1].replace('.xml', '');
    result.uri = documentIdentifier;
    formattedResults.push(result)
  }
  return formattedResults;
}

function basicSearch(searchTerms){
  searchTerms = searchTerms.replace(/AND NOT/g, "'ftand ftnot'");
  searchTerms = searchTerms.replace(/AND/g, "'ftand'");
  searchTerms = searchTerms.replace(/OR/g, "'ftor'");
  searchTerms = searchTerms.replace(/NOT/g, "'ftnot'");

  searchString = ` json:serialize(
  <results>{
  for $letter in db:open("Colenso")
  where $letter[//text() contains text '%SEARCH_TERMS%' using wildcards]

  return

        <result
          title="{$letter//title/text()}"
          author="{$letter/TEI/teiHeader/fileDesc/titleStmt/author/name/text()}"
          uri="{document-uri($letter)}"/>
    }</results>, map{'format': 'jsonml'})`
  return namespace + searchString.replace("%SEARCH_TERMS%", searchTerms);
}

function advancedSearch(xquery){
  searchString = ` json:serialize(
  <results>{
  for $letter in db:open("Colenso")
  where $letter%XQUERYEXPRESSION%

  return

        <result
          title="{$letter//title/text()}"
          author="{$letter/TEI/teiHeader/fileDesc/titleStmt/author/name/text()}"
          uri="{document-uri($letter)}"/>
    }</results>, map{'format': 'jsonml'})`
  return namespace + searchString.replace("%XQUERYEXPRESSION%", xquery);

}

/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log(req.query);
  client.execute("OPEN Colenso");

  var query = basicSearch(req.query.q);
  if (req.query.type === 'advanced') {
    query = advancedSearch(req.query.q);
  }

  console.log(query);
  client.execute(query, function(error, result){
    if (!error) {

      var parsedResults = JSON.parse(result.result).slice(2);
      var formattedResults = formatResults(parsedResults);

      res.render('results', {data: formattedResults});

    } else {
      console.log(error);
    }

  });

});

module.exports = router;
