/**
 * @function
 *
 * simple shoppingCar
 */
var shoppingCar = module.exports = function () {
	var fruitPrice = { apple: 50, orange: 40 };
	
	/**
	* simple calculate implementation
	* @param String name an fruit's name
	* @param int numbers how many fruit
	* @return int totalPrice
	*/
	this.priceCal = function (name, numbers) {
		return fruitPrice[name] * numbers;
	}

};

