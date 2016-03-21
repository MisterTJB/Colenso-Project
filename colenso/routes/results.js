var express = require('express');
var router = express.Router();

var basex = require('basex');
var client = new basex.Session("127.0.0.1", 1984, "admin", "admin");

var namespace = "XQUERY declare default element namespace 'http://www.tei-c.org/ns/1.0';";

function basicSearch(searchTerms){
  searchTerms = searchTerms.replace(/AND NOT/g, "'ftand ftnot'");
  searchTerms = searchTerms.replace(/AND/g, "'ftand'");
  searchTerms = searchTerms.replace(/OR/g, "'ftor'");
  searchTerms = searchTerms.replace(/NOT/g, "'ftnot'");

  searchString = ` for $letter in db:open("Colenso")
                   where $letter[//text() contains text '%SEARCH_TERMS%' using wildcards]
                   return
                      <li>{$letter//title/text()}</li>`
  return namespace + searchString.replace("%SEARCH_TERMS%", searchTerms);
}

/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log(req.query);
  client.execute("OPEN Colenso");
  var query = basicSearch(req.query.q);
  console.log(query);
  client.execute(query, function(error, result){
    if (!error) {
      console.log(result);
      res.render('results', {data: result.result});

    } else {
      console.log(error);
    }

  });

});

module.exports = router;
