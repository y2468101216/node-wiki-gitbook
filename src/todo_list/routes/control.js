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
  if (typeof req.user != 'undefined') {
    dbConn.connect(function (db) {
      switch (req.query.method) {
        case 'insert':
          dbCRUDControl.insert({ event: req.body.event, userId: req.user.id }, db, function (err, results) {
            if (err) throw err;
            db.close();
            res.redirect('/');
          });
          break;
        case 'update':
          dbCRUDControl.update({ event: req.body.updateImportEventText, id: req.body.updateImportEventId, userId: req.user.id }, db, function (err, results) {
            if (err) throw err;
            db.close();
            res.redirect('/');
          });
          break;
        case 'delete':
          dbCRUDControl.delete({ id: req.body.deleteImportEventId, userId: req.user.id }, db, function (err, results) {
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
  } else {
    res.redirect('/');
  }
});

module.exports = router;
