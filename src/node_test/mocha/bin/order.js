module.exports = function(){
	var order;
	
	this.setOrder = function(importOrder){
		order = importOrder;
	}
	
	this.priceTotal = function(){
		var price = 0;
		for(var i in order){
			price += order[i]['price'] * order[i]['numbers'];
		}
		return price;
	}
}