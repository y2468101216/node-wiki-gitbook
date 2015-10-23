var dbConn = {};
var assert = require('assert');
var order = require('./bin/order.js');
var orderTest = new order();


describe('firstTest', function () {
	before(function () {
		dbConn.Memberselect = function (memberName) {
			if (typeof memberName == 'string') {
				if (memberName == 'a') {
					var cursor = { 1: { name: 'a', price: 100, numbers: 1 }, 2: { name: 'b', price: 200, numbers: 2 } };
				} else {
					var cursor = null;
				}
			} else {
				var cursor = null;
			}
			return cursor;
		}
	});

	it('price total should be 500', function () {
		var cursor = dbConn.Memberselect('a');
		orderTest.setOrder(cursor);
		var expected = 500;
		var actual = orderTest.priceTotal();
		assert.equal(actual, expected);
	});
	
	it('price total should be 0', function () {
		var cursor = dbConn.Memberselect(null);
		orderTest.setOrder(cursor);
		var expected = 0;
		var actual = orderTest.priceTotal();
		assert.equal(actual, expected);
	});
});