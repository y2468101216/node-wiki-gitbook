/**
 * Name:dbConnect.js 
 * Purpose:connect mongodb 
 * Author:Yun 
 * Version:1.0
 * Update:2015-10-15
 */

module.exports = function () {
	var MongoClient = require('mongodb').MongoClient;//mongodb client
	var url = 'mongodb://localhost:27017/todo_list_test';// mongodb://登入url/db名稱
	
	this.connect = function (callback) {
		MongoClient.connect(url, function (err, db) {
			if (err) {
				throw err;
			} else {
				callback(db);
			}
		});
	}	
}

