/**
 * Name:index.js 
 * Purpose:show index.html
 * Author:Yun 
 * Version:1.0
 * Update:2015-10-20
 */

var express = require('express');
var router = express.Router();

var dbConnect = require('../bin/dbConnect.js');
var dbConn = new dbConnect();

var dbCRUD = require('../bin/dbCRUD.js');
var dbCRUDMethod = new dbCRUD();

/* GET home page. */
router.get('/', function (req, res, next) {
  dbConn.connect(function (db) {
    dbCRUDMethod.select(null, db, function (cursor) {
      var data = [];
      cursor.forEach(function(result){
        data.push(result);
        db.close();
      },function(err){
        if(err) throw err;
        res.render('index', { title: 'Express', cursor: data });
      });
     
    });
  });

});

module.exports = router;
