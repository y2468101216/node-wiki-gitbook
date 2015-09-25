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

<https://github.com/y2468101216/node-wiki-gitbook/tree/master/src/node_mysql>

```

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

<https://github.com/y2468101216/node-wiki-gitbook/tree/master/src/node_mysql_parameterized_query>

```

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

# 參考資料
* wiki-SQL injection:<https://zh.wikipedia.org/wiki/SQL資料隱碼攻擊>
* wiki-Parameterized Query:<https://zh.wikipedia.org/wiki/參數化查詢>
node-mysql:<https://github.com/felixge/node-mysql/#preparing-queries>