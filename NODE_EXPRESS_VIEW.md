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

# 實例一 MVC基本範例
讓我們做個範例，建立一個名叫**node_mvc_1**目錄
你可以參考 <https://github.com/y2468101216/node-wiki-gitbook/tree/master/src/node_mvc_1>

```
node_mvc_1/
├── bin/
|	├── download.js
├── download/
│	├── a.txt
│   ├── b.txt
├── public/
│   ├── index.html
└── app.js
```

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
&#60;!DOCTYPE html&#62;
&#60;html&#62;
&#60;head&#62;
&#60;meta charset="UTF-8"&#62;
&#60;title&#62;Node MVC 1&#60;/title&#62;
&#60;/head&#62;
&#60;body&#62;
	&#60;div&#62;
		&#60;a href="./download/a.txt"&#62;download a&#60;/a&#62;
	&#60;/div&#62;
	&#60;div&#62;
		&#60;a href="./download/b.txt"&#62;download b&#60;/a&#62;
	&#60;/div&#62;
	&#60;div&#62;
		&#60;a href="./download/c.txt"&#62;download c&#60;/a&#62;
	&#60;/div&#62;
&#60;/body&#62;
&#60;/html&#62;
```

app.js:
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

這是一個下載檔案的範例，在index.html裡有三個超連結分別對應a.txt、b.txt、c.txt。但你可以注意到在download目錄裡
並沒有c.txt，所以他應該會回傳error，不過今天的重點不在那邊，讓我們回頭來看app.js

app.js把檢查檔案是否存在的邏輯處理抽離另外做成一個class，讓app.js只單純處理controller的問題：轉傳給model，回傳給view。

這樣的好處是你易於維護，不會因為一個程式bug導致整個server crush，當然檔案跟程式碼會變得比較多，但整體而言複雜度是下降的。

#實例二 輸出文字
在node.js裡面view engine分成兩個：jade跟ejs，我會談跟php想法比較接近的ejs。

如果跟我一樣有做過php的話，那你應該記得php本身即是個view engine這件事，但很可惜的是node.js並不能直接
這樣輸出，但他有類似的東西可以讓你無痛轉換，沒錯！就是ejs

讓我們來看看以下實例: