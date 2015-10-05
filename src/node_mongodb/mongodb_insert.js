/**
 * Name:mongodb_insert.js 
 * Purpose:connect & insert mongodb 
 * Author:Yun 
 * Version:1.0
 * Update:2015-09-30
 */

var MongoClient = require('mongodb').MongoClient;// mongodb client
var assert = require('assert');// 測試工具

var url = 'mongodb://localhost:27017/test';// mongodb://登入url/db名稱

//插入資料到
var insertDocument = function(db, callback) {
	// 打開集合（沒有的話會自動建一個)->插入一筆資料
	db.collection('restaurants').insertOne({
		"address" : {
			"street" : "2 Avenue",
			"zipcode" : "10075",
			"building" : "1480",
			"coord" : [ -73.9557413, 40.7720266 ]
		},
		"borough" : "Manhattan",
		"cuisine" : "Italian",
		"grades" : [ {
			"date" : new Date("2014-10-01T00:00:00Z"),
			"grade" : "A",
			"score" : 11
		}, {
			"date" : new Date("2014-01-16T00:00:00Z"),
			"grade" : "B",
			"score" : 17
		} ],
		"name" : "Vella",
		"restaurant_id" : "41704620"
	}, function(err, result) {
		assert.equal(err, null);// 如果不是期望值(null)，則throw error
		console.log("Inserted a document into the restaurants collection.");
		callback(result);
	});
};

//進行連線
MongoClient.connect(url, function(err, db) {
	assert.equal(null, err);// 如果不是期望值(null)，則throw error
	insertDocument(db, function() {
		db.close();//關閉連線
	});
});