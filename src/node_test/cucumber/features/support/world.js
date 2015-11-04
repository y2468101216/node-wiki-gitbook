/**
 * @function
 *
 * world is a constructor function
 * with utility properties,
 * destined to be used in step definitions
 */
var cwd = process.cwd();
var path = require('path');

var Calculator = require(path.join(cwd, 'lib', 'shoppingCar'));

module.exports = function() {
    this.calculator = new Calculator();
    this.assert = require('assert');
}