var express = require('express');
var router = express.Router();
var basex = require('basex');
var client = new basex.Session("127.0.0.1", 1984, "admin", "admin");

var Archiver = require('archiver');
var jsonfile = require('jsonfile');
var util = require('util');
var file = "logs/search.json";

var namespace = "XQUERY declare default element namespace 'http://www.tei-c.org/ns/1.0';";

function basicSearch(searchTerms, subset){
  searchTerms = searchTerms.replace(/AND NOT/g, "'ftand ftnot'");
  searchTerms = searchTerms.replace(/AND/g, "'ftand'");
  searchTerms = searchTerms.replace(/OR/g, "'ftor'");
  searchTerms = searchTerms.replace(/NOT/g, "'ftnot'");

  searchString = `

declare namespace functx = "http://www.functx.com";
declare function functx:is-value-in-sequence
  ( $value as xs:anyAtomicType? ,
    $seq as xs:anyAtomicType* )  as xs:boolean {

   $value = $seq
 } ;


  json:serialize(
  <results>{
    let $colenso := fn:collection("Colenso")
    let $subset := %FILTER_DOCS%
    let $matches := ($colenso//text()[. contains text '%SEARCH_TERMS%'])
    for $match in $matches
    where functx:is-value-in-sequence(base-uri($match), $subset)
    let $uri := base-uri($match)
    let $title := doc($uri)//title
    let $author := doc($uri)/TEI/teiHeader/fileDesc/titleStmt/author/name
    let $score := ft:score($match[. contains text '%SEARCH_TERMS%'])
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
  return namespace + searchString.replace(/%SEARCH_TERMS%/g, searchTerms).replace("%FILTER_DOCS%", subset);
}

function formatResults(parsedResults){
  var uniqueIDs = new Set();
  var formattedResults = [];
  for (var i=0; i < parsedResults.length; i++){
    var result = parsedResults[i][1];
    result.databaseURI = result.uri
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

router.get('/download', function(req, res, next){


  var zip = Archiver('zip');

    // Send the file to the page output.
    zip.pipe(res);

    for (param in req.query){
      var name = req.query[param];
      var savePath = name.split("/")[name.split("/").length - 1]
      name = "public/" + name;
      zip.file(name, {name: savePath});
    }
    zip.finalize(function(err, bytes){
      if(err){
        console.log(err);
      }
    });

});

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


router.post('/', function(req, res, next) {
  var documents = req.body['uris[]'];
  var query = req.body.q;


  var filterOn = `(`;
  for (var i=0; i < documents.length - 1; i++){
    filterOn = filterOn + "'" + documents[i] + "',";
  } filterOn = filterOn + "'" + documents[i] + "')";

  var baseXQuery = basicSearch(query, filterOn);

  client.execute(baseXQuery, function(error, result){
    if (!error) {

      var parsedResults = JSON.parse(result.result).slice(2);
      var formattedResults = formatResults(parsedResults);
      res.send(res.render('result', {query: query, data: formattedResults, results: formattedResults.length}));
      var data= {time: prepareDate(new Date()), user: req.cookies.user, search: query, type: "Nested", count: formattedResults.length};
      logSearch(data);


    } else {
      console.log(error);
    }

  });



});

module.exports = router;
