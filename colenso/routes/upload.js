var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');

var basex = require('basex');
var client = new basex.Session("127.0.0.1", 1984, "admin", "admin");


var multer  = require('multer')
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
})
var upload = multer({ dest: 'uploads/', storage: storage}).single('newdocument')


var xsd = require('libxml-xsd');


function validateXML(file, callback) {
  xsd.parseFile("public/tei_ms/tei_ms.xsd", function(err, Schema){
    Schema.validateFile(file, callback);
  });
};


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('upload', {xmlData: ''});
});

router.post('/', function(req, res, next) {
  upload(req, res, function (err) {
    if (err) {
      // An error occurred when uploading
      return
    } else {
      console.log("validating XML: " + "uploads/" + req.file.originalname)
      validateXML("uploads/" + req.file.originalname, function(err, validationErrors) {
        console.log("err: " + err + ", validationErrors: " + validationErrors);
        if (validationErrors){
          fs.unlink("uploads/" + req.file.originalname);
          res.render('upload', {xmlData: validationErrors});
      } else {
        res.render('upload', {xmlData: "UPLOADED"});
        var xmlData = fs.readFileSync("uploads/" + req.file.originalname, encoding="utf-8");
        client.execute("OPEN Colenso");
        client.add(req.file.originalname, xmlData, function (error, result){
          console.log(error);
          console.log(result);
          client.execute("CLOSE Colenso");
        });

      }
    });
  }
  });
});


module.exports = router;
