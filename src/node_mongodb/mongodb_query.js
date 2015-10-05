/**
 * Name:mongodb_query.js 
 * Purpose:connect & insert mongodb 
 * Author:Yun 
 * Version:1.0
 * Update:2015-10-01
 */

var MongoClient = require('mongodb').MongoClient;//mongodb client
var assert = require('assert');// 測試工具
var url = 'mongodb://localhost:27017/test';// mongodb://登入url/db名稱

//查詢資料
var findRestaurants = function(findCondition, db, callback) {
	   var cursor =db.collection('restaurants').find(findCondition);
	   //將每筆資料倒出來
	   cursor.each(function(err, doc) {
	      assert.equal(err, null);
	      if (doc != null) {
	    	 //列印查詢條件
	    	 console.dir('find:');
	    	 console.log(findCondition);
	    	 //列印資料
	         console.dir(doc);
	      } else {
	         callback();
	      }
	   });
	};
	
	//列出全部的集合裡的資料
	MongoClient.connect(url, function(err, db) {
		  assert.equal(null, err);
		  findRestaurants(null, db, function() {
		      db.close();
		  });
		});
	
	//尋找address.zipcode等於10075的
	MongoClient.connect(url, function(err, db) {
		  assert.equal(null, err);
		  findRestaurants({ "address.zipcode": "10075" }, db, function() {
		      db.close();
		  });
		});
	
	//尋找address.zipcode等於10076的
	MongoClient.connect(url, function(err, db) {
		  assert.equal(null, err);
		  findRestaurants({ "name": "Vella" }, db, function() {
		      db.close();
		  });
		});	