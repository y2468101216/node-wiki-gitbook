# 用 Express 和 MongoDB 寫一個 todo list（node版本:4.1.1)

練習一種語言或是 framework 最快的入門方式就是寫一個 todo list 了. 他包含了基本的 C.R.U.D. ( 新增, 讀取, 更新, 刪除 ). 這篇文章將用 node.js 裡最通用的 framework Express 架構 application 和 MongoDB 來儲存資料.

原始檔
======

<https://github.com/y2468101216/node-wiki-gitbook/tree/master/src/todo_list>

功能
====

* 使用facebook登入, 用 session 來辨別每一問使用者
* 可以新增, 讀取, 更新, 刪除待辦事項( todo item )

開發環境
====

開始之前請確定你已經安裝了 node.js, Express, MongoDB, express-generator，如果沒有可以翻找本書前面的目錄進行安裝

node.js 套件
============

本次我們將使用node.js, Express, MongoDB, express-generator, ejs來開發

這個練習裡我們用 Mongoose 這個 ORM. 為何會需要一個必須定義 schema 的 ORM 來操作一個 schema-less 的資料庫呢? 原因是在一般的網站資料結構的關聯, 驗證都是必須處理的問題. Mongoose 在這方面可以幫你省去很多功夫. 我們會在後面才看如何安裝.


步驟
====

用 Express 的 command line 工具幫我們生成一個 project 雛形
預設的 template engine 是 jade, 在這裡我們改用比較平易近人的 ejs.

```

$ express todo_list -e --git

```

(只適用mac使用者)在專案根目錄修改 .gitignore，在最後一行加入
 
```

#mac style file
.DS_Store

```

# Welcome to Express
開啟 express server 然後打開瀏覽器瀏覽 127.0.0.1:3000 就會看到歡迎頁面.

```

$ DEBUG=todo_list npm start

```

![](img/zh-tw/todo_list/express_test.png)

Project 檔案結構

```

todo_list
|-- bin
|   |-- www
|  
|-- node_modules
|   |-- body-parser //負責處理post傳回來的資料
|   |-- cookie-parser //處理cookie
|   |-- debug
|   |-- ejs //view engine
|   |-- express //web server
|   |-- mongodb //db server
|   |-- morgan //紀錄http request log
|   `-- serve-favicon //db server 
|
|-- public
|   |-- images
|   |-- javascripts
|   `-- stylesheets
|       |-- style.css
|
|-- routes
|   `-- index.js
|
|-- views
|   |-- index.ejs
|   `-- error.ejs
|
|-- .gitignore
|
|-- app.js
|
`-- package.json

```
* bin - 邏輯檔
* node_modules  - 包含所有 project 相關套件.
* public - 包含所有靜態檔案.
* routes - 路由檔.
* views - 包含 action views, partials 還有 layouts.
* app.js - 包含設定, middlewares, 和 routes 的分配.
* package.json - 相關套件的設定檔.

# 安裝mongoDB

打開package.json，在dependencies插入兩行

```
 "mongodb": "~2.0.0"
```

然後npm會自動讀取package.json
```

npm install

```

就會幫我們mongoDB裝好了

# 安裝測試工具-mocha

我們是好孩子，所以要寫tdd，詳細的介紹在NODE_TEST裡

```

$ npm install -g mocha

```

MongoDB CRUD
=========================

我們需要先寫CRUD的測試

新增一個test目錄並建立一個dbCRUDTest.js的檔案，程式碼如下:

```

var dbConnect = require('../bin/dbConnect.js');
var dbConnectTest = new dbConnect();
var crud = require('../bin/dbCRUD.js');
var crudTest = new crud();

describe('dbTest', function () {
	it('connect', function (done) {
		dbConnectTest.connect(function (db) {
			db.admin().serverInfo(function (err, results) {
				db.close();
				if (err) throw err;
				done();
			});
		});
	});

	it('select', function (done) {
		dbConnectTest.connect(function (db) {
			crudTest.select(null, db, function (err, results) {
				db.close();
				if (err) throw err;
				done();
			});
		});
	});

	it('insert', function (done) {
		dbConnectTest.connect(function (db) {
			crudTest.insert({ userId: '1234', event: 'test' }, db, function (err, results) {
				db.close();
				if (err) throw err;
				done();
			});
		});
	});

	it('update', function (done) {
		dbConnectTest.connect(function (db) {
			crudTest.update({ _id: 1, event: 'test2', userId:'1234' }, db, function (err, results) {
				db.close();
				if (err) throw err;
				done();
			});
		});
	});

	it('delete', function (done) {
		dbConnectTest.connect(function (db) {
			crudTest.delete({ _id: 1, userId:'1234' }, db, function (err, results) {
				db.close();
				if (err) throw err;
				done();
			});
		});
	});
});

```
做測試之前我們需要先把mongodb打開

在 Ubuntu 上 MongoDB 開機後便會自動開啟. 在 Mac 上你需要手動輸入下面的指令.

```

$ mongod

```

在bin/下新增一個檔案叫做 dbConnect.js 來設定 MongoDB

```

/**
 * Name:dbConnect.js 
 * Purpose:connect mongodb 
 * Author:Yun 
 * Version:1.0
 * Update:2015-10-15
 */

module.exports = function () {
	var MongoClient = require('mongodb').MongoClient;//mongodb client
	var url = 'mongodb://localhost:27017/todo_list_test';// mongodb://登入url/db名稱
	
	this.connect = function (callback) {
		MongoClient.connect(url, function (err, db) {
			if (err) {
				throw err;
			} else {
				callback(db);
			}
		});
	}	
}

```

在bin/下新增一個檔案叫做 dbCRUD.js，這是給todo_list讀寫資料庫用的。

```

/**
 * Name:dbCRUD.js 
 * Purpose:todo_list CRUD
 * Author:Yun 
 * Version:1.0
 * Update:2015-10-15
 */

module.exports = function () {
    
}
 
```

進行第一次測試，請切換到todo_list目錄底下，執行以下指令

```

$ mocha test/dbCRUDTest.js

```

![](img/zh-tw/todo_list/dbCRUDTestFirst.png)

如上圖所示，你可以注意到雖然connect過了，但是CRUD沒有過，因為我們還未定義dbCRUD.js的function，讓我們把洞補起來。

修改dbCRUD.js如下

```

/**
 * Name:dbCRUD.js 
 * Purpose:todo_list CRUD
 * Author:Yun 
 * Version:1.0
 * Update:2015-10-15
 */

module.exports = function () {

	this.select = function (findCondition, db, callback) {
		var cursor = db.collection('event').find(findCondition);
		cursor.count(function(err, count){
			if(err == null){
				if(count == 0){
					err = 'nothing to found';
				}
			}
			callback(err, cursor);
		});
	}
	
	this.insert = function (insertObject, db, callback) {
		db.collection('event').insertOne({event:insertObject.event, userId:insertObject.userId}, function (err, results) {
			callback(err, results);
		});
	}

	this.update = function (updateObject, db, callback) {
		db.collection('event').updateOne({event:updateObject.event}, {_id:updateObject.id, userId:updateObject.userId}, function (err, results) {
			callback(err, results);
		});
	}
	
	this.delete = function (deleteObject, db, callback) {
		db.collection('event').deleteOne({_id:deleteObject.id, userId:deleteObject.userId}, function (err, results) {
			callback(err, results);
		});
	}
}

```

執行第二次測試如下

```

$ mocha test/dbCRUDTest.js

```

![](img/zh-tw/todo_list/dbCRUDTestSecond.png)

這次就全數通過了。

修改 index view
---------------

我們需要一個 text input 來新增待辦事項. 在這裡我們用 POST form 來傳送資料.
views/index.ejs



    <h1><%= title %></h1>
    <form action="/create" method="post" accept-charset="utf-8">
      <input type="text" name="content" />
    </form>

新增待辦事項以及存檔，routes/index.js，首先先 require mongoose 和 Todo model.



    var mongoose = require( 'mongoose' );
    var Todo     = mongoose.model( 'Todo' );

新增成功後將頁面導回首頁.



    exports.create = function ( req, res ){
      new Todo({
        content    : req.body.content,
        updated_at : Date.now()
      }).save( function( err, todo, count ){
        res.redirect( '/' );
      });
    };

將這個新增的動作加到 routes 裡.

app.js



    // 新增下列語法到 routes
    app.post( '/create', routes.create );

顯示待辦事項
routes/index.js



    // 查詢資料庫來取得所有待辦是事項.
    exports.index = function ( req, res ){
      Todo.find( function ( err, todos, count ){
        res.render( 'index', {
            title : 'Express Todo Example',
            todos : todos
        });
      });
    };

views/index.ejs



    // 在最下面跑回圈來秀出所有待辦事項.
    <% todos.forEach( function( todo ){ %>
      <p><%= todo.content %></p>
    <% }); %>

刪除待辦事項
在每一個待辦事項的旁邊加一個刪除的連結.
routes/index.js



    // 根据待辦事項的 id 来移除他
    exports.destroy = function ( req, res ){
      Todo.findById( req.params.id, function ( err, todo ){
        todo.remove( function ( err, todo ){
          res.redirect( '/' );
        });
      });
    };

views/index.ejs



    // 在迴圈裡加一個删除連結
    <% todos.forEach( function ( todo ){ %>
      <p>
        <span>
          <%= todo.content %>
        </code>
        <span>
          <a href="/destroy/<%= todo._id %>" title="Delete this todo item">Delete</a>
        </code>
      </p>
    <% }); %>

將這個刪除的動作加到 routes 裡.
app.js



    // 新增下列語法到 routes
    app.get( '/destroy/:id', routes.destroy );

編輯待辦事項
當滑鼠點擊待辦事項時將他轉成一個 text input.
routes/index.js



    exports.edit = function ( req, res ){
      Todo.find( function ( err, todos ){
        res.render( 'edit', {
            title   : 'Express Todo Example',
            todos   : todos,
            current : req.params.id
        });
      });
    };

Edit view 基本上和 index view 差不多, 唯一的不同是在選取的那個待辦事項變成 text input.
views/edit.ejs



    <h1><%= title %></h1>
    <form action="/create" method="post" accept-charset="utf-8">
      <input type="text" name="content" />
    </form>
     
    <% todos.forEach( function ( todo ){ %>
      <p>
        <span>
          <% if( todo._id == current ){ %>
          <form action="/update/<%= todo._id %>" method="post" accept-charset="utf-8">
            <input type="text" name="content" value="<%= todo.content %>" />
          </form>
          <% }else{ %>
            <a href="/edit/<%= todo._id %>" title="Update this todo item"><%= todo.content %></a>
          <% } %>
        </code>
        <span>
          <a href="/destroy/<%= todo._id %>" title="Delete this todo item">Delete</a>
        </code>
      </p>
    <% }); %>

將待辦事項包在一個 link 裡, link 可以連到 edit 動作.
views/index.ejs



    <h1><%= title %></h1>
    <form action="/create" method="post" accept-charset="utf-8">
      <input type="text" name="content" />
    </form>
     
    <% todos.forEach( function ( todo ){ %>
      <p>
        <span>
          <a href="/edit/<%= todo._id %>" title="Update this todo item"><%= todo.content %></a>
        </code>
        <span>
          <a href="/destroy/<%= todo._id %>" title="Delete this todo item">Delete</a>
        </code>
      </p>
    <% }); %>

將這個編輯的動作加到 routes 裡.
app.js



    // 新增下列語法到 routes
    app.get( '/edit/:id', routes.edit );

更新待辦事項
新增一個 update 動作來更新待辦事項.
routes/index.js



    // 結束後重新導回首頁
    exports.update = function ( req, res ){
      Todo.findById( req.params.id, function ( err, todo ){
        todo.content    = req.body.content;
        todo.updated_at = Date.now();
        todo.save( function ( err, todo, count ){
          res.redirect( '/' );
        });
      });
    };

將這個更新的動作加到 routes 裡.
app.js



    // 新增下列語法到 routes
    app.post( '/update/:id', routes.update );

排序
現在待辦事項是最早產生的排最前面, 我們要將他改為最晚產生的放最前面.
routes/index.js



    exports.index = function ( req, res ){
      Todo.
        find().
        sort( '-updated_at' ).
        exec( function ( err, todos ){
          res.render( 'index', {
              title : 'Express Todo Example',
              todos : todos
          });
        });
    };
     
    exports.edit = function ( req, res ){
      Todo.
        find().
        sort( '-updated_at' ).
        exec( function ( err, todos ){
          res.render( 'edit', {
              title   : 'Express Todo Example',
              todos   : todos,
              current : req.params.id
          });
        });
    };

多重使用者
現在所有使用者看到的都是同一份資料. 意思就是說每一個人的 todo list 都長得一樣, 資料都有可能被其他人修改. 我們可以用 cookie 來記錄使用者資訊讓每個人有自己的 todo list. Express 已經有內建的 cookie, 只要在 app.js 新增一個 middleware 就好. 另外我們也會需要新增一個依據 cookie 來抓取當下的使用者的 middleware.
app.js



    var express = require( 'express' );
     
    var app = module.exports = express.createServer();
     
    // 設定 mongoose
    require( './db' );
     
    // 將 routes 移到 middlewares 設定上面
    var routes = require( './routes' );
     
    // 設定 middleware
    // 移除 methodOverride, 新增 favicon, logger 並將 static middleware 往上移
    app.configure( function (){
      app.set( 'views', __dirname + '/views' );
      app.set( 'view engine', 'ejs' );
      app.use( express.favicon());
      app.use( express.static( __dirname + '/public' ));
      app.use( express.logger());
      app.use( express.cookieParser());
      app.use( express.bodyParser());
      app.use( routes.current_user );
      app.use( app.router );
    });
     
    app.configure( 'development', function (){
      app.use( express.errorHandler({ dumpExceptions : true, showStack : true }));
    });
     
    app.configure( 'production', function (){
      app.use( express.errorHandler());
    });
     
    // Routes
    app.get( '/', routes.index );
    app.post( '/create', routes.create );
    app.get( '/destroy/:id', routes.destroy );
    app.get( '/edit/:id', routes.edit );
    app.post( '/update/:id', routes.update );
     
    app.listen( 3000, function (){
      console.log( 'Express server listening on port %d in %s mode', app.address().port, app.settings.env );
    });

routes/index.js



    var mongoose = require( 'mongoose' );
    var Todo     = mongoose.model( 'Todo' );
    var utils    = require( 'connect' ).utils;
     
    exports.index = function ( req, res, next ){
      Todo.
        find({ user_id : req.cookies.user_id }).
        sort( '-updated_at' ).
        exec( function ( err, todos, count ){
          if( err ) return next( err );
     
          res.render( 'index', {
              title : 'Express Todo Example',
              todos : todos
          });
        });
    };
     
    exports.create = function ( req, res, next ){
      new Todo({
          user_id    : req.cookies.user_id,
          content    : req.body.content,
          updated_at : Date.now()
      }).save( function ( err, todo, count ){
        if( err ) return next( err );
     
        res.redirect( '/' );
      });
    };
     
    exports.destroy = function ( req, res, next ){
      Todo.findById( req.params.id, function ( err, todo ){
        if( todo.user_id !== req.cookies.user_id ){
          return utils.forbidden( res );
        }
     
        todo.remove( function ( err, todo ){
          if( err ) return next( err );
     
          res.redirect( '/' );
        });
      });
    };
     
    exports.edit = function( req, res, next ){
      Todo.
        find({ user_id : req.cookies.user_id }).
        sort( '-updated_at' ).
        exec( function ( err, todos ){
          if( err ) return next( err );
     
          res.render( 'edit', {
            title   : 'Express Todo Example',
            todos   : todos,
            current : req.params.id
          });
        });
    };
     
    exports.update = function( req, res, next ){
      Todo.findById( req.params.id, function ( err, todo ){
        if( todo.user_id !== req.cookies.user_id ){
          return utils.forbidden( res );
        }
     
        todo.content    = req.body.content;
        todo.updated_at = Date.now();
        todo.save( function ( err, todo, count ){
          if( err ) return next( err );
     
          res.redirect( '/' );
        });
      });
    };
     
    // ** 注意!! express 會將 cookie key 轉成小寫 **
    exports.current_user = function ( req, res, next ){
      if( !req.cookies.user_id ){
        res.cookie( 'user_id', utils.uid( 32 ));
      }
     
      next();
    };


Error handling
==============

要處理錯誤我們需要新增 next 參數到每個 action 裡. 一旦錯誤發生遍將他傳給下一個 middleware 去處理.
routes/index.js



    ... function ( req, res, next ){
      // ...
    };
     
    ...( function( err, todo, count ){
      if( err ) return next( err );
     
      // ...
    });

Run application
===============



    $ node app.js

到此為止我們已經完成了大部分的功能了. 原始碼裡有多加了一點 css 讓他看起來更美觀. 趕快開啟你的 server 來玩玩看吧 :)

