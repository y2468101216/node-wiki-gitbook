#前言

不懂Database的人不是Backend Engineer，可見Database多麼重要。
本章節將會舉一個關聯式資料庫:mysql跟一個NOSQL:MongoDB的串連。
本章節不會撰述安裝資料庫跟SQL語法

#關聯式資料庫:mysql

首先須先安裝mysql套件:

```
npm install mysql
```

# 範例一:基本範例

<https://github.com/y2468101216/node-wiki-gitbook/tree/master/src/node_mysql/mysql.js>

```javascript
/**
 * Name:mysql.js
 * Purpose:mysql 連接教學
 * Author:Yun
 * Version:1.0
 * Update:2015-09-25
 */

var mysql = require('mysql');

//建立連線資料
var connection = mysql.createConnection({
  host     : 'localhost',//資料庫IP
  user     : 'root',//使用者名稱
  password : 'root',//使用者密碼
  database : 'localhost'//資料庫名稱
});

//嘗試連線
connection.connect();

//倒出SQL結果
connection.query('SELECT 1 + 1 AS solution', function(err, rows, fields) {
  if (err) throw err;

  console.log('The solution is: ', rows[0].solution);
});

//結束連線
connection.end();
```

結果:

```
The solution is:  2
```

比較值得一提的是`connection.end();`這個語法，如果你有寫php就知道PDO是不需要close connection的。
(詳見<http://stackoverflow.com/questions/18277233/pdo-closing-connection>)

也就是說他比較像mysqli。

# 範例二:Parameterized Query

在開始之前先講一下SQL Injection:

* wiki的解釋:

SQL攻擊（SQL injection），簡稱隱碼攻擊，是發生於應用程式之資料庫層的安全漏洞。簡而言之，是在輸入的字串之中夾帶SQL指令，在設計不良的程式當中忽略了檢查，那麼這些夾帶進去的指令就會被資料庫伺服器誤認為是正常的SQL指令而執行，因此遭到破壞或是入侵。

所以就出現了Parameterized Query：

* wiki的解釋:

參數化查詢（Parameterized Query或Parameterized Statement）是指在設計與資料庫連結並存取資料時，在需要填入數值或資料的地方，使用參數（Parameter）來給值，這個方法目前已被視為最有效可預防SQL資料隱碼攻擊的攻擊手法的防禦方式。

除了安全因素，相比起拼接字串的SQL語句，參數化的查詢往往有效能優勢。因為參數化的查詢能讓不同的資料通過參數到達資料庫，從而公用同一條SQL語句。大多數資料庫會快取解釋SQL語句產生的位元組碼而省下重複解析的開銷。如果採取拼接字串的SQL語句，則會由於運算元據是SQL語句的一部分而非參數的一部分，而反覆大量解釋SQL語句產生不必要的開銷。

<https://github.com/y2468101216/node-wiki-gitbook/tree/master/src/node_mysql/node_mysql_parameterized_query.js>

```javascript
/**
 * Name:mysql.js
 * Purpose:mysql Parameterized Query
 * Author:Yun
 * Version:1.0
 * Update:2015-09-25
 */

var mysql = require('mysql');

var connection = mysql.createConnection({
  host     : 'localhost',//資料庫IP
  user     : 'root',//使用者名稱
  password : 'root',//使用者密碼
  database : 'localhost'//資料庫名稱
});

//嘗試連線
connection.connect();

//倒出SQL結果
connection.query('SELECT ? + ? AS solution',[1,2], function(err, rows, fields) {
  if (err) throw err;

  console.log('The solution is: ', rows[0].solution);
});

//結束連線
connection.end();
```

你可以注意到只有`connection.query`改變而已，裡面多插入一個陣列，這種寫法在需要大量插入或更新重複的SQL時異常好用，
你不需要撰寫SQL只需更換參數就可以，可以節省許多行數。

#NOSQL:MongoDB

NOSQL是最近很火紅的資料庫型態，特徵是不使用任何SQL語言、不需要規劃table架構，是一個新興的資料庫型態。
我會花比較多篇幅講這個，因為這是一個從觀念上完全不一樣的東西。

首先須先安裝mongodb套件:

```
npm install mongodb
```

* 插入資料<https://github.com/y2468101216/node-wiki-gitbook/tree/master/src/node_mongodb/mongodb_insert.js>

```javascript
/**
 * Name:mongodb_update.js
 * Purpose:connect & insert mongodb
 * Author:Yun
 * Version:1.0
 * Update:2015-09-30
 */

var MongoClient = require('mongodb').MongoClient;// mongodb client
var assert = require('assert');// 測試工具

var url = 'mongodb://localhost:27017/test';// mongodb://登入url/db名稱

//插入資料到
var insertDocument = function(db, callback) {
	// 打開集合（沒有的話會自動建一個)->插入一筆資料
	db.collection('restaurants').insertOne({
		"address" : {
			"street" : "2 Avenue",
			"zipcode" : "10075",
			"building" : "1480",
			"coord" : [ -73.9557413, 40.7720266 ]
		},
		"borough" : "Manhattan",
		"cuisine" : "Italian",
		"grades" : [ {
			"date" : new Date("2014-10-01T00:00:00Z"),
			"grade" : "A",
			"score" : 11
		}, {
			"date" : new Date("2014-01-16T00:00:00Z"),
			"grade" : "B",
			"score" : 17
		} ],
		"name" : "Vella",
		"restaurant_id" : "41704620"
	}, function(err, result) {
		assert.equal(err, null);// 如果不是期望值(null)，則throw error
		console.log("Inserted a document into the restaurants collection.");
		callback(result);
	});
};

//進行連線
MongoClient.connect(url, function(err, db) {
	assert.equal(null, err);// 如果不是期望值(null)，則throw error
	insertDocument(db, function() {
		db.close();//關閉連線
	});
});
```

執行後印出

```
Inserted a document into the restaurants collection.
```

你可以注意到在存資料時他的擴展性很強(注意grades)，不同於一般的資料庫。

* 查詢資料<https://github.com/y2468101216/node-wiki-gitbook/tree/master/src/node_mongodb/mongodb_query.js>

```javascript
/**
 * Name:mongodb_query.js
 * Purpose:connect & insert mongodb
 * Author:Yun
 * Version:1.0
 * Update:2015-10-01
 */

var MongoClient = require('mongodb').MongoClient;//mongodb client
var assert = require('assert');// 測試工具
var url = 'mongodb://localhost:27017/test';// mongodb://登入url/db名稱

//查詢資料
var findRestaurants = function(findCondition, db, callback) {
	var cursor =db.collection('restaurants').find(findCondition);
	//將每筆資料倒出來
	cursor.each(function(err, doc) {
	assert.equal(err, null);
	if (doc != null) {
	 	//列印查詢條件
	 	console.dir('find:');
	 	console.log(findCondition);
	 	//列印資料
	  console.dir(doc);
	} else {
	  callback();
	}
	});
};

//列出全部的集合裡的資料
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  findRestaurants(null, db, function() {
    db.close();
  });
});

//尋找address.zipcode等於10075的
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  findRestaurants({ "address.zipcode": "10075" }, db, function() {
    db.close();
  });
});

//尋找address.zipcode等於10076的
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  findRestaurants({ "address.zipcode": "10076" }, db, function() {
    db.close();
  });
});		
```

執行結果:

```
'find:'

{ _id: { _bsontype: 'ObjectID', id: 'V\fß¨8ßZ×Bo;\\' },
  address:
   { street: '2 Avenue',
     zipcode: '10075',
     building: '1480',
     coord: [ -73.9557413, 40.7720266 ] },
  borough: 'Manhattan',
  cuisine: 'Italian',
  grades:
   [ { date: Wed Oct 01 2014 08:00:00 GMT+0800 (CST),
       grade: 'A',
       score: 11 },
     { date: Thu Jan 16 2014 08:00:00 GMT+0800 (CST),
       grade: 'B',
       score: 17 } ],
  name: 'Vella',
  restaurant_id: '41704620' }
'find:'
{ 'address.zipcode': '10075' }
{ _id: { _bsontype: 'ObjectID', id: 'V\fß¨8ßZ×Bo;\\' },
address:
 { street: '2 Avenue',
   zipcode: '10075',
   building: '1480',
   coord: [ -73.9557413, 40.7720266 ] },
borough: 'Manhattan',
cuisine: 'Italian',
grades:
[ { date: Wed Oct 01 2014 08:00:00 GMT+0800 (CST),
   grade: 'A',
   score: 11 },
 { date: Thu Jan 16 2014 08:00:00 GMT+0800 (CST),
   grade: 'B',
   score: 17 } ],
name: 'Vella',
restaurant_id: '41704620' }

'find:'
{ 'address.zipcode': '10076' }
```

你可以注意到mongodb插入的時候多插了一個_id，那是mongodb的主鍵，不重複唯一，
mongodb用它來分別每一筆資料。

find其實就相當SQL裡的where，但他比where強的地方是在於說他可以查詢dot notation(EX:address.zipcode)。
這點是SQL所做不到的

* 更新資料<https://github.com/y2468101216/node-wiki-gitbook/tree/master/src/node_mongodb/mongodb_query.js>

```javascript
/**
 * Name:mongodb_update.js
 * Purpose:connect & insert mongodb
 * Author:Yun
 * Version:1.0
 * Update:2015-10-02
 */

var MongoClient = require('mongodb').MongoClient;// mongodb client
var assert = require('assert');// 測試工具

var url = 'mongodb://localhost:27017/test';// mongodb://登入url/db名稱

var updateRestaurants = function(db, callback) {
	db.collection('restaurants').updateOne(
	  { "name" : "Vella" },//設定條件
	  {
	    $set: { "cuisine": "American (New)" },
	    $currentDate: { "lastModified": true }
	  }, //設定更新項目
	  function(err, results) {
	  console.log(results);//印出更新結果
	  callback();
	});
};

MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);

  updateRestaurants(db, function() {
    db.close();
  });
});
```

執行結果:

```javascript
{ result: { ok: 1, nModified: 1, n: 1 },
  connection:
   { domain: null,
     _events:
      { close: [Object],
        error: [Object],
        timeout: [Object],
        parseError: [Object],
        connect: [Function] },
     _maxListeners: undefined,
     options:
      { socketOptions: {},
        auto_reconnect: true,
        host: 'localhost',
        port: 27017,
        cursorFactory: [Object],
        reconnect: true,
        emitError: true,
        size: 5,
        disconnectHandler: [Object],
        bson: {},
        messageHandler: [Function],
        wireProtocolHandler: {} },
     id: 2,
     logger: { className: 'Connection' },
     bson: {},
     tag: undefined,
     messageHandler: [Function],
     maxBsonMessageSize: 67108864,
     port: 27017,
     host: 'localhost',
     keepAlive: true,
     keepAliveInitialDelay: 0,
     noDelay: true,
     connectionTimeout: 0,
     socketTimeout: 0,
     destroyed: false,
     domainSocket: false,
     singleBufferSerializtion: true,
     serializationFunction: 'toBinUnified',
     ca: null,
     cert: null,
     key: null,
     passphrase: null,
     ssl: false,
     rejectUnauthorized: false,
     responseOptions: { promoteLongs: true },
     flushing: false,
     queue: [],
     connection:
      { _connecting: false,
        _hadError: false,
        _handle: [Object],
        _parent: null,
        _host: 'localhost',
        _readableState: [Object],
        readable: true,
        domain: null,
        _events: [Object],
        _maxListeners: undefined,
        _writableState: [Object],
        writable: true,
        allowHalfOpen: false,
        destroyed: false,
        bytesRead: 71,
        _bytesDispatched: 223,
        _pendingData: null,
        _pendingEncoding: '',
        _idleNext: null,
        _idlePrev: null,
        _idleTimeout: -1,
        read: [Function],
        _consuming: true },
     writeStream: null,
     buffer: null,
     sizeOfMessage: 0,
     bytesRead: 0,
     stubBuffer: null },
  matchedCount: 1,
  modifiedCount: 1,
  upsertedId: null,
  upsertedCount: 0 }
```

這樣只會更新第一筆找到的資料。
跟查詢一樣，你可以使用dot notation作為更新條件

* 刪除資料

```javascript
/**
 * Name:mongodb_delete.js
 * Purpose:connect & update mongodb
 * Author:Yun
 * Version:1.0
 * Update:2015-10-02
 */

var MongoClient = require('mongodb').MongoClient;// mongodb client
var assert = require('assert');// 測試工具

var url = 'mongodb://localhost:27017/test';// mongodb://登入url/db名稱

var removeRestaurants = function(db, callback) {
	db.collection('restaurants').deleteOne(
	  { "borough": "Queens" },//設定條件
	  function(err, results) {
			console.log(results);//印出更新結果
			callback();
	  }
	);
};

MongoClient.connect(url, function(err, db) {
	assert.equal(null, err);

	removeRestaurants(db, function() {
	  db.close();
	});
});

```

```javascript
{ result: { ok: 1, nModified: 1, n: 1 },
  connection:
   { domain: null,
     _events:
      { close: [Object],
        error: [Object],
        timeout: [Object],
        parseError: [Object],
        connect: [Function] },
     _maxListeners: undefined,
     options:
      { socketOptions: {},
        auto_reconnect: true,
        host: 'localhost',
        port: 27017,
        cursorFactory: [Object],
        reconnect: true,
        emitError: true,
        size: 5,
        disconnectHandler: [Object],
        bson: {},
        messageHandler: [Function],
        wireProtocolHandler: {} },
     id: 2,
     logger: { className: 'Connection' },
     bson: {},
     tag: undefined,
     messageHandler: [Function],
     maxBsonMessageSize: 67108864,
     port: 27017,
     host: 'localhost',
     keepAlive: true,
     keepAliveInitialDelay: 0,
     noDelay: true,
     connectionTimeout: 0,
     socketTimeout: 0,
     destroyed: false,
     domainSocket: false,
     singleBufferSerializtion: true,
     serializationFunction: 'toBinUnified',
     ca: null,
     cert: null,
     key: null,
     passphrase: null,
     ssl: false,
     rejectUnauthorized: false,
     responseOptions: { promoteLongs: true },
     flushing: false,
     queue: [],
     connection:
      { _connecting: false,
        _hadError: false,
        _handle: [Object],
        _parent: null,
        _host: 'localhost',
        _readableState: [Object],
        readable: true,
        domain: null,
        _events: [Object],
        _maxListeners: undefined,
        _writableState: [Object],
        writable: true,
        allowHalfOpen: false,
        destroyed: false,
        bytesRead: 71,
        _bytesDispatched: 223,
        _pendingData: null,
        _pendingEncoding: '',
        _idleNext: null,
        _idlePrev: null,
        _idleTimeout: -1,
        read: [Function],
        _consuming: true },
     writeStream: null,
     buffer: null,
     sizeOfMessage: 0,
     bytesRead: 0,
     stubBuffer: null },
  matchedCount: 1,
  modifiedCount: 1,
  upsertedId: null,
  upsertedCount: 0 }
```

這樣只會刪除一筆，跟update其實沒差多少

# 結語

MongoDB跟Node.js就跟mysql之於php一樣，天生一對，但這並不代表你不能用其他的資料庫。
根據專案選擇你要的才是正確的。
# 參考資料
* wiki-SQL injection:<https://zh.wikipedia.org/wiki/SQL資料隱碼攻擊>
* wiki-Parameterized Query:<https://zh.wikipedia.org/wiki/參數化查詢>
* node-mysql:<https://github.com/felixge/node-mysql/#preparing-queries>
* NOSQL:<https://zh.wikipedia.org/wiki/NoSQL>
* MONGODB:<https://docs.mongodb.org/getting-started/node/>
