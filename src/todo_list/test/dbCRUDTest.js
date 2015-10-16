var dbConnect = require('../bin/dbConnect.js');
var dbConnectTest = new dbConnect();
var crud = require('../bin/dbCRUD.js');
var crudTest = new crud();

describe('dbTest', function () {
	it('connect', function (done) {
		dbConnectTest.connect(function (db) {
			db.admin().serverInfo(function (err, results) {
				db.close();
				if (err) throw err;
				done();
			});
		});
	});

	it('select', function (done) {
		dbConnectTest.connect(function (db) {
			crudTest.select(null, db, function (err, results) {
				db.close();
				if (err) throw err;
				done();
			});
		});
	});

	it('insert', function (done) {
		dbConnectTest.connect(function (db) {
			crudTest.insert({ userId: '1234', event: 'test' }, db, function (err, results) {
				db.close();
				if (err) throw err;
				done();
			});
		});
	});

	it('update', function (done) {
		dbConnectTest.connect(function (db) {
			crudTest.update({ _id: 1, event: 'test2', userId:'1234' }, db, function (err, results) {
				db.close();
				if (err) throw err;
				done();
			});
		});
	});

	it('delete', function (done) {
		dbConnectTest.connect(function (db) {
			crudTest.delete({ _id: 1, userId:'1234' }, db, function (err, results) {
				db.close();
				if (err) throw err;
				done();
			});
		});
	});
});



