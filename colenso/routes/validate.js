var express = require('express');
var router = express.Router();
var xsd = require('libxml-xsd');
var xmlParser = require('libxml-xsd').libxmljs;

function validateXML(data, callback) {
  console.log("Parsing schema");
  xsd.parseFile("public/tei_ms/tei_ms.xsd", function(err, Schema){
    console.log("Validating file");
    Schema.validate(data, callback);
  });
};

router.post('/', function(req, res, next) {
  var xmlData = '<?xml version="1.0" encoding="UTF-8"?>' + req.body.xml;
  console.log(xmlData);


  validateXML(xmlData, function(err, validationErrors){
    if (err){
      var response = "";
      response = response + err;
      res.send(response);
    } else {
      if (validationErrors){
        var response = "";
        for (var i=0; i<validationErrors.length; i++){
          response = response + "<p>" + validationErrors[i] + "</p>"
        }
        res.send(response);
      } else {
        console.log("XML validated successfully");
        res.send("Validates");
      }
    }

  });
});

module.exports = router;
