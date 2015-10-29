var assert = require('assert');

describe('asyncTest', function () {

	it('async_Test_Without_Done()', function () {
		var actual;
		var exected;
		var fs = require('fs');
		fs.stat('./asyncTest.js', function (err, stats) {
			var actual = stats.isFile();
			var exected = false;
			assert.equal(actual, exected);
		});
	});

	it('async_Test_With_Done()', function (done) {
		var actual;
		var exected;
		var fs = require('fs');
		fs.stat('./asyncTest.js', function (err, stats) {
			var actual = stats.isFile();
			var exected = false;
			assert.equal(actual, exected);
			done();
		});
	});


}); 