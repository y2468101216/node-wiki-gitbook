/**
 * Name:app.js
 * Purpose:ejs express example 
 * Author:Yun 
 * Version:1.0 
 * Update:2015-09-22
 */

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

var options = {
		root : __dirname + '/public/',
		dotfiles : 'deny',
		headers : {
			'x-timestamp' : Date.now(),
			'x-sent' : true
		}
	};

//create application/x-www-form-urlencoded parser
app.use(bodyParser.urlencoded({
	extended : true
}));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

//index page 
app.get('/', function(req, res) {
    res.sendFile('index.html',options,function(err){
    	if(err){
    		console.log(err);
    	}
    });
});

//login 
app.post('/login',function(req, res){
	var loginClass = require('./bin/login.js');
	var login = new loginClass();
	login.check(req.body.account, req.body.password,function(returnMessage, isError){
		res.send({message:returnMessage,error:isError});
	});
});

console.log('server is running');

app.listen(8080);