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
router.get('/', function (req, res) {
  dbConn.connect(function (db) {
    if (typeof req.user == 'undefined') {
      res.render('index', { name: false, cursor: false });
    } else {
      dbCRUDMethod.select({userId:req.user.id}, db, function (cursor) {
        var data = [];
        cursor.forEach(function (result) {
          data.push(result);
          db.close();
        }, function (err) {
          if (err) throw err;
          res.render('index', { name: req.user.displayName, cursor: data });

        });

      });
    }

  });

});

module.exports = router;


