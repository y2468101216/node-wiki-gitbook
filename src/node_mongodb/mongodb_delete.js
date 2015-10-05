/**
 * Name:mongodb_delete.js 
 * Purpose:connect & update mongodb 
 * Author:Yun 
 * Version:1.0
 * Update:2015-10-02
 */

var MongoClient = require('mongodb').MongoClient;// mongodb client
var assert = require('assert');// 測試工具

var url = 'mongodb://localhost:27017/test';// mongodb://登入url/db名稱

var removeRestaurants = function(db, callback) {
	   db.collection('restaurants').deleteOne(
	      { "borough": "Queens" },//設定條件
	      function(err, results) {
	         console.log(results);//印出更新結果
	         callback();
	      }
	   );
	};
	
	MongoClient.connect(url, function(err, db) {
		  assert.equal(null, err);

		  removeRestaurants(db, function() {
		      db.close();
		  });
		});