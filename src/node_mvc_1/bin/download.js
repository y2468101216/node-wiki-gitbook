/**
 * Name:downlaod.js
 * Purpose:Model download example 
 * Author:Yun
 * Version:1.0
 * Update:2015-09-22
 */
module.exports = function(){
	this.checkFile = function(pathString, callback){
		var fs = require('fs');
		fs.stat(pathString,function(err, stats){
			if(!err){
				callback(true);
			}else{
				callback(false);
			}
		});
	}
}