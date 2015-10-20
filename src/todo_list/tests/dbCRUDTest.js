var dbConnect = require('../bin/dbConnect.js');
var dbConnectTest = new dbConnect();
var crud = require('../bin/dbCRUD.js');
var crudTest = new crud();
var assert = require('assert');

describe('dbTest', function () {
	before('create Test Collection', function (done) {
		console.log('createTestCollection');
		dbConnectTest.connect(function (db) {
			db.createCollection('event', function (err, results) {
				db.close();
				assert.equal(null, err);
				done();
			});
		});
	});

	it('connect Should Be Success', function (done) {
		dbConnectTest.connect(function (db) {
			db.admin().serverInfo(function (err, results) {
				db.close();
				assert.equal(null, err);
				done();
			});
		});
	});
		
	it('insert Should Be Success', function (done) {
		dbConnectTest.connect(function (db) {
			crudTest.insert({ userId: '1234', event: 'test' }, db, function (err, results) {
				db.close();
				if (err) throw err;
				done();
			});
		});
	});

	it('select Should Not Be 0', function (done) {
		dbConnectTest.connect(function (db) {
			crudTest.select(null, db, function (cursor) {
				cursor.count(function (err, count) {
					db.close();
					assert.equal(null, err);
					assert.notEqual(count, 0);
					done();
				});

			});
		});
	});

	it('update Should Be Success. But Update Nothing', function (done) {
		dbConnectTest.connect(function (db) {
			crudTest.update({ _id: 1, event: 'test2', userId: '1234' }, db, function (err, results) {
				db.close();
				assert.equal(null, err);
				assert.equal(0,results.modifiedCount)
				done();
			});
		});
	});

	it('delete Should Be Success. But Delete Nothing', function (done) {
		dbConnectTest.connect(function (db) {
			crudTest.delete({ _id: 1, userId: '1234' }, db, function (err, results) {
				db.close();
				assert.equal(null, err);
				assert.equal(0,results.deletedCount)
				done();
			});
		});
	});

	after('drop Test Collection', function (done) {
		console.log('dropTestCollection');
		dbConnectTest.connect(function (db) {
			db.dropCollection('event', function (err, results) {
				db.close();
				assert.equal(null, err);
				done();
			});
		});
		
	});
});



