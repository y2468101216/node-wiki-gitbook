# Express_View 介紹

在開始本章節以前先來談談MVC架構

#M(MODEL)V(VIEW)C(CONTROLL)

MVC是近年來流行的web架構，但這個概念並不限定在web上，連android都有實做類似的概念。
何謂MVC?你問工程師每個人的看法都不大一樣，但他們都一致同意好的工程師一定要會MVC。

在這裡提供wiki看法:

*（控制器 Controller）- 負責轉發請求，對請求進行處理。
*（視圖 View） - 介面設計人員進行圖形介面設計。
*（模型 Model） - 程式設計師編寫程式應有的功能（實作演算法等等）、資料庫專家進行資料管理和資料庫設計(可以實作具體的功能)。

轉換成node.js的說法就是：

*（控制器 Controller）- server(express)，接受參數(POST OR GET)後轉傳至要執行的程式，若有需要則回傳結果。
*（視圖 View） - html部分，為了輸出Controller的訊息，會需要用到view engine，下面會介紹ejs跟angular.js
*（模型 Model）- 邏輯處理

讓我們做個範例，建立一個名叫**node_mvc_1**目錄

- bin
-- download.js
- download
-- a.txt
-- b.txt
- public
-- index.html
- express_route.js

bin/download.js:
```
/**
 * Name:download.js
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
```

public/index.html:

```
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Node MVC 1</title>
</head>
<body>
	<div>
		<a href="./download/a.txt">download a</a>
	</div>
	<div>
		<a href="./download/b.txt">download b</a>
	</div>
	<div>
		<a href="./download/c.txt">download c</a>
	</div>
</body>
</html>
```

```
/**
 * Name:app.js
 * Purpose:controller express example 
 * Author:Yun 
 * Version:1.0 
 * Update:2015-09-22
 */

var express = require('express');
var app = express();

app.get('/', function(req, res) {
	var options = {
		root : __dirname + '/public/',
		dotfiles : 'deny',
		headers : {
			'x-timestamp' : Date.now(),
			'x-sent' : true
		}
	};
	
	res.sendFile('index.html', options, function(err) {
		if (err) {
			res.status(err.status).end();
		} else {
			// console.log('Sent:index.html');
		}
	});
});

app.get('/download/:name', function(req, res) {
	var downloadClass = require('./bin/download.js');
	var dl = new downloadClass();
	var pathString = './download/' + req.params.name;

	dl.checkFile(pathString, function(isFile) {
		if (isFile) {
			res.download(pathString);
		} else {
			res.send('error');
		}
	});
});

console.log('server is running');

app.listen(8080);
```