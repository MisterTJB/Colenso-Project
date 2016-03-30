var express = require('express');
var router = express.Router();
var basex = require('basex');
var client = new basex.Session("127.0.0.1", 1984, "admin", "admin");

var namespace = "XQUERY declare default element namespace 'http://www.tei-c.org/ns/1.0';";
var updateQuery = namespace + `
declare namespace functx = "http://www.functx.com";
declare function functx:is-value-in-sequence
  ( $value as xs:anyAtomicType? ,
    $seq as xs:anyAtomicType* )  as xs:boolean {

   $value = $seq
 };
for $letter in fn:collection("Colenso")
let $document_ids := %DOCUMENT_IDS%
where functx:is-value-in-sequence(base-uri($letter), $document_ids)
return insert node <search_group name="%NAME%" description="%DESCRIPTION%"/> into $letter/TEI/teiHeader`

router.post('/', function(req, res, next) {

  var documents = req.body["documents[]"];
  var name = req.body.name;
  var description = req.body.description;

  var document_ids = `(`;
  for (var i=0; i < documents.length - 1; i++){
    document_ids += "'" + documents[i] + "',";
  } document_ids += "'" + documents[i] + "')";

  var query = updateQuery.replace("%DOCUMENT_IDS%", document_ids).replace("%NAME%", name).replace("%DESCRIPTION%", description);
  client.execute(query, function(error, result){
    if (!error) {
      console.log("Added <search_group>");
    } else {
      console.log(error);
    }
  });


});

module.exports = router;
