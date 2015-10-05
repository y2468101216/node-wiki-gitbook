/**
 * Name:mongodb_update.js 
 * Purpose:connect & update mongodb 
 * Author:Yun 
 * Version:1.0
 * Update:2015-10-02
 */

var MongoClient = require('mongodb').MongoClient;// mongodb client
var assert = require('assert');// 測試工具

var url = 'mongodb://localhost:27017/test';// mongodb://登入url/db名稱

var updateRestaurants = function(db, callback) {
	   db.collection('restaurants').updateOne(
	      { "name" : "Vella" },//設定條件
	      {
	        $set: { "cuisine": "American (New)" },
	        $currentDate: { "lastModified": true }
	      }, //設定更新項目
	      function(err, results) {
	      console.log(results);//印出更新結果
	      callback();
	   });
	};
	
	MongoClient.connect(url, function(err, db) {
		  assert.equal(null, err);

		  updateRestaurants(db, function() {
		      db.close();
		  });
		});