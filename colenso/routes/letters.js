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

/* GET users listing. */
router.get('/:letter', function(req, res, next) {

  var interpolatedQuery = query.replace("%LETTERID%", req.params.letter);
  console.log(query);
  var xmlData = client.execute(interpolatedQuery, function(error, result){

    if (!error) {
      res.render('letters', {data: result.result});

    } else {
      console.log(error);
    }

  });
});

module.exports = router;
