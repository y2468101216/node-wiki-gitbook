/**
 * Name:dbCRUD.js 
 * Purpose:todo_list CRUD
 * Author:Yun 
 * Version:1.0
 * Update:2015-10-15
 */

module.exports = function () {

	this.select = function (findCondition, db, callback) {
		var cursor = db.collection('event').find(findCondition);
		callback(cursor);
	}
	
	this.insert = function (insertObject, db, callback) {
		db.collection('event').insertOne({event:insertObject.event, userId:insertObject.userId}, function (err, results) {
			callback(err, results);
		});
	}

	this.update = function (updateObject, db, callback) {
		var ObjectID = require('mongodb').ObjectID
		var id = new ObjectID(updateObject.id);
		db.collection('event').updateOne({_id:id, userId:updateObject.userId}, {$set:{event:updateObject.event}} ,function (err, results) {
			callback(err, results);
		});
	}
	
	this.delete = function (deleteObject, db, callback) {
		var ObjectID = require('mongodb').ObjectID
		var id = new ObjectID(deleteObject.id);
		db.collection('event').deleteOne({_id:id, userId:deleteObject.userId}, function (err, results) {
			callback(err, results);
		});
	}
}