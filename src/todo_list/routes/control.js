/**
 * Name:control.js 
 * Purpose:update insert delete todo_list
 * Author:Yun 
 * Version:1.0
 * Update:2015-10-21
 */

var express = require('express');
var router = express.Router();

/* insert home page. */
router.post('/', function (req, res, next) {
  var Db = require('../bin/DbConnect.js');
  var dbConn = new Db();
  var dbCRUD = require('../bin/dbCRUD.js');
  var dbCRUDControl = new dbCRUD();
  dbConn.connect(function (db) {
    switch (req.query.method) {
      case 'insert':
        dbCRUDControl.insert({ event: req.body.event, userId: 1234 }, db, function (err, results) {
          if (err) throw err;
          db.close();
          res.redirect('/');
        });
        break;
      default:
        res.redirect('/');
        break;
    }
  });
});

module.exports = router;
