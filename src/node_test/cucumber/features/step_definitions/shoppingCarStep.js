/**
 * calculate step
 */

module.exports = function() {
    var self = this;

    this.Given('the item "$itemName"', function(itemName, callback) {
        self.itemName = itemName;
        callback();
    });
    
    this.Given('the numbers "$numbers"', function(numbers, callback) {
        self.numbers = numbers;
        callback();
    });

    this.When(/^the calculator is run$/, function(callback) {
        self.result = self.calculator.priceCal(self.itemName, self.numbers);
        callback();
    });

    this.Then('the output should be "$output"', function(output, callback) {
        self.assert.equal(self.result,output);
        callback();
    });
}