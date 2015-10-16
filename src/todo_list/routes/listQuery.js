var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var Db = require('../bin/Db.js');
  var dbConn = new Db();
  dbConn.connect(function(db){
    db.admin().serverinfo(function(err, result){
      if(err) throw err;
      console.log(result)
    });
  })
  res.render('index', { title: 'Express' });
});

module.exports = router;
