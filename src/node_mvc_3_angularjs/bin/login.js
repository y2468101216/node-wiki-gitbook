/**
 * Name:login.js
 * Purpose:ejs login example 
 * Author:Yun 
 * Version:1.0 
 * Update:2015-09-22
 */

module.exports = function (){
	this.check = function (account, password, callback){
		var message = 'login success';
		var error = false;
		
		if(account != 'test' && error == false){
			message = 'account error';
			error = true;
		}
		
		if(password != 'test' && error == false){
			message = 'password error';
			error = true;
		}
		
		callback(message, error);
	}
}