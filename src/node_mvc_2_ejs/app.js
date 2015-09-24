/**
 * Name:app.js
 * Purpose:ejs express example 
 * Author:Yun 
 * Version:1.0 
 * Update:2015-09-22
 */

var express = require('express');
var bodyParser = require('body-parser');

//create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

var app = express();
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

//index page 
app.get('/', function(req, res) {
    res.render('index.html',{message:false});
});

//login 
app.post('/login',function(req, res){
	var loginClass = require('./bin/login.js');
	var login = new loginClass();
	login.check(req.body.account, req.body.password,function(returnMessage, isError){
		res.render('index.html',{message:returnMessage,error:isError});
	});
});

console.log('server is running');

app.listen(8080);