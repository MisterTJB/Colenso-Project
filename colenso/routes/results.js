var express = require('express');
var router = express.Router();

var basex = require('basex');
var client = new basex.Session("127.0.0.1", 1984, "admin", "admin");
var jsonfile = require('jsonfile');
var util = require('util');
var file = "logs/search.json";


var namespace = "XQUERY declare default element namespace 'http://www.tei-c.org/ns/1.0';";

function formatResults(parsedResults){
  var uniqueIDs = new Set();
  var formattedResults = [];
  for (var i=0; i < parsedResults.length; i++){
    var result = parsedResults[i][1];
    result.databaseURI = result.uri;
    if (!uniqueIDs.has(result.databaseURI)){
      var uriComponents = result.uri.split("/");
      var documentIdentifier = uriComponents[uriComponents.length - 1].replace('.xml', '');
      result.uri = documentIdentifier;
      uniqueIDs.add(result.databaseURI);
      formattedResults.push(result)
    }
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
    let $colenso := fn:collection("Colenso")
    let $matches := $colenso//text()[. contains text '%SEARCH_TERMS%']
    for $match in $matches

    let $uri := base-uri($match)
    let $title := doc($uri)//title
    let $author := doc($uri)/TEI/teiHeader/fileDesc/titleStmt/author/name
    let $score := ft:score($match[. contains text "%SEARCH_TERMS%"])
    let $sent :=  doc($uri)//correspAction[@type = "sent"]/date/text()
    let $created := doc($uri)//creation/date/@when
    let $wordCount := count(ft:tokenize(doc($uri)))

    let $context := ft:extract($match[. contains text '%SEARCH_TERMS%'], "b")
  order by $created ascending
  return
    <result
          title="{$title}"
          author="{$author}"
          uri="{$uri}"
          context="{$context}"
          score="{$score}"
          sent="{$sent}"
          created="{$created}"
          wordCount="{$wordCount}"/>
    }</results>, map{'format': 'jsonml'})`
  return namespace + searchString.replace(/%SEARCH_TERMS%/g, searchTerms);
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

function logSearch(newData){
  jsonfile.readFile(file, function(err, obj) {
    obj.push(newData);
    jsonfile.writeFile(file, obj, function(err){
      console.log(err);
    });
  });
}

function prepareDate(date) {

  function pad(number) {
    if (number < 10) {
      return '0' + number;
    }
    return number;
  }

  return date.getUTCFullYear() +
      '-' + pad(date.getMonth() + 1) +
      '-' + pad(date.getDate()) +
      ' ' + pad(date.getHours()) +
      ':' + pad(date.getMinutes()) +
      ':' + pad(date.getSeconds());
};

/* GET users listing. */
router.get('/', function(req, res, next) {

  var query = basicSearch(req.query.q);
  if (req.query.type === 'advanced') {
    query = advancedSearch(req.query.q);
  }
  console.log(query);
  client.execute(query, function(error, result){
    if (!error) {
      var parsedResults = JSON.parse(result.result).slice(2);
      var formattedResults = formatResults(parsedResults);
      res.render('results', {query: req.query, data: formattedResults, results: formattedResults.length});
      var data= {time: prepareDate(new Date()), user: req.cookies.user, search: req.query.q, type: req.query.type, count: formattedResults.length};
      logSearch(data);


    } else {
      console.log(error);
    }

  });

});

module.exports = router;
