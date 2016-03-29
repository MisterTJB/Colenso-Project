var express = require('express');
var router = express.Router();

var jsonfile = require('jsonfile');
var util = require('util');
var file = "logs/search.json";

router.get('/', function(req, res, next) {
  var searches = jsonfile.readFileSync(file);
  res.render('admin', {searchData: searches})

});


module.exports = router;
