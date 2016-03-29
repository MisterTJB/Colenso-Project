var express = require('express');
var router = express.Router();

var basex = require('basex');
var client = new basex.Session("127.0.0.1", 1984, "admin", "admin");

var query = `
  XQUERY declare default element namespace 'http://www.tei-c.org/ns/1.0';
  for $letter in db:open("Colenso")
  where contains(document-uri($letter), "%LETTERID%")
  return $letter
`

var deleteQuery = `
XQUERY
let $documentURI := document-uri(%IDENTIFIER%)
return db:delete("Colenso", $documentURI)`

/* GET users listing. */
router.get('/:letter', function(req, res, next) {
  console.log(next);
  var interpolatedQuery = query.replace("%LETTERID%", req.params.letter);
  console.log(query);
  var xmlData = client.execute(interpolatedQuery, function(error, result){

    if (!error && result.result.length > 0) {
      res.render('letters', {data: result.result, letterID: req.params.letter});

    } else if (result.result.length == 0){
      res.render('error', {message: req.params.letter + " does not exist", error: {status: "404", stack: ""}});
    }else {
      console.log(error);
    }

  });
});

var filepathQuery = `
  XQUERY declare default element namespace 'http://www.tei-c.org/ns/1.0';
  for $letter in db:open("Colenso")
  where contains(document-uri($letter), "%LETTERID%")
  return document-uri($letter)
`

router.get('/:letter/download', function(req, res, next){
  var filename = req.params.letter;
  console.log("Trying to download " + filename);

  var interpolatedQuery = filepathQuery.replace("%LETTERID%", req.params.letter);
  client.execute(interpolatedQuery, function(error, result){

    if (!error) {
      console.log(result.result);
      res.download("public/" + result.result, req.params.letter + ".xml");
    } else {
      console.log(error);
    }

  });
});

router.get('/:letter/delete', function(req, res, next){
  client.execute("OPEN Colenso");
  client.execute(`DELETE "%FILE%"`.replace("%FILE%", req.params.letter + ".xml"), function(error, result){
    if (!error) {
      console.log(result.result);
      res.redirect("/");
    } else {
      console.log(error);
    }
  });
  client.execute("CLOSE Colenso");
});

var replaceQuery = `
  XQUERY declare default element namespace 'http://www.tei-c.org/ns/1.0';
  for $letter in db:open("Colenso")
  where contains(document-uri($letter), "%LETTERID%")
  return replace node $letter/TEI with %DATA%
`

router.post('/:letter/save', function(req, res, next){
  var xml = req.body.editedXML;
  client.execute(replaceQuery.replace("%LETTERID%", req.params.letter).replace("%DATA%", xml), function(error, result){
    if (!error) {
      console.log("Successfully updated");
      res.redirect('/letters/' + req.params.letter);
      console.log(result.result);
    } else {
      console.log(error);
    }
  });
});

module.exports = router;
