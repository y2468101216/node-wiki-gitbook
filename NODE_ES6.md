##前言

有慣常留意 Node.js 社群的開發者們應該都知道剛剛有一個重大更新，現時最新的版本到了 v4.1。然而根據 Node.js 在發佈 v4.0 的時候釋放的官方文檔，指出剛在六月正式發佈 ECMAScript 6 (下稱 ES6) 會分三個階段納入最新的版本當中。它們分別是:

+ Shipping features:
已經完成整合並且被 V8 開發團隊視為穩定
+ Staged features:
大致完成整合但並不能確定能夠穩定運行
+ In progress features
僅用於測試

(註: 在 Node.js v4.0 或更新版本的環境中)

除了 Shipping features 以外，開發者如要使用其他的語法特性需要自行承擔風險。

##如何在 Node.js 啟用對 ES6 的支援
###在 v4.0 及其以後的更新版本
+ Shipping features 並不需要加上 runtime flag 已經可以直接在最新版本的 Node.js 環境中使用
+ Staged features 需要加上 runtime flag (`--es_staging` 或 `--harmony`) 才可以使用
+ In progress features 需要加上 runtime flag `--harmony_<name>`, 在 harmony_ 後面的是那語法特性的名稱,如果開發者想知道有甚麼是正在整合當中的話,可以使用`node --v8-options | grep "in progress"`去查詢

在 v4.0 下的 In progress 特性:

```
--harmony_modules (enable "harmony modules" (in progress))
--harmony_array_includes (enable "harmony Array.prototype.includes" (in progress))
--harmony_regexps (enable "harmony regular expression extensions" (in progress))
--harmony_proxies (enable "harmony proxies" (in progress))
--harmony_sloppy (enable "harmony features in sloppy mode" (in progress))
--harmony_unicode_regexps (enable "harmony unicode regexps" (in progress))
--harmony_reflect (enable "harmony Reflect API" (in progress))
--harmony_destructuring (enable "harmony destructuring" (in progress))
--harmony_sharedarraybuffer (enable "harmony sharedarraybuffer" (in progress))
--harmony_atomics (enable "harmony atomics" (in progress))
--harmony_new_target (enable "harmony new.target" (in progress))
```

###在 v4.0 以前的版本
由於在 v4.0 以前的版本並不原生支援 ES6 的語法特性,所以我們需要一個 JavaScript 編譯器,把 ES6 的語法轉換成 ES5 的版本。Babel 是一個開源專案,如果需要在舊的 Node.js 環境中寫 ES6 的語法就可以用到它,使用的方法很容易,先用 npm 把它安裝起來。

`$npm install babel -g`

然後就直接可以轉換 ES6 的語法

`babel myes6.js`

##Shipping Features
以下這些語法特性已經在最新的版本環境釋出:

###索引

- [let,const](#let-const)
- [class](#class)
- [Map](#map)
- [WeakMap](#weakmap)
- [Set](#set)
- [WeakSet](#weakset)
- [Typed Arrays](#typed-arrays)
- [Generator](#generator)
- [Binary and Octal](#binary-and-octal-grammar)
- [Object Literal Extension](#extension-for-object-literal)
- [New String Methods](#new-string-methods)
- [Symbols](#symbols)
- [Template Strings](#template-strings)
- [Arrow Functions](#arrow-functions)
- [Promises](#promises)
- [for...of Loops](#forof-loops)

###[let](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let), [const](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const)
ES6 引入了塊級域的變量(block scope variables),使變量的作用域限制於兩個括號裡頭。跟 `var` 不同的是 `var` 所定義的變量要麼是全局(global),要麼是函數域(function scope),不能是塊級域的。比對以下例子就會明白。

```javascript
var globalVar = 1;
if (true) {
  globalVar = 3;
}
console.log(globalVar); // 3
```

若使用 `let` 定義變數的話,在 Block 以外想要知道它的值是不能夠的

```javascript
if (true) {
  let blockVar = 3;
}
console.log(blockVar); // undefined
```

錯誤使用 `let` 所引起的問題可以參照[這裡](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/let#let_的临时失效区与错误)

至於 `const` 固名思義就是常數,是不可變的(immutable)。

```javascript
const constant = 3;
constant = 0;
console.log(constant); // 3
```
同一個名的常數亦不能重覆宣告,否則會引起 `TypeError`。
```javascript
const constant = 3;
const constant = 3; // TypeError: Identifier 'constant' has already been declared
```

###[class](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes)
事實上這不是一種新加入的面向編程概念,然而這只是把現有 JavaScript 裡頭基於原型(prototype)的繼承(inheritance)做法重新包裝,是一種語法糖(syntax sugar)而已,使程式碼更加簡單易明。看看在 ES6 之前的做法是如何:

```javascript
var Plane = function () {}
Plane.prototype.landing = function () {}
function A380 () {}
A380.prototype = new Plane();
var emirates_a380 = new A380 ();
console.log(emirates_a380 instanceof A380); // true
console.log(emirates_a380 instanceof Plane); // true
```

再看看在 ES6 裡頭使用 `class`

```javascript
'use strict';

class Plane {
  constructor () {
      // ...
  }
  takeoff () {
    console.log('Taking off');
  }
}

class A380 extends Plane {
  constructor () {
    super();
  }
}

var emirates_a380 = new A380();
console.log(emirates_a380 instanceof A380); // true
console.log(emirates_a380 instanceof Plane); // true
```

結果顯而易見,程式碼看起上來更直覺,更清楚易明。

###[Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)
這個物件就是簡單的鍵/值(key/value)對應表,長久以來人們都是使用 Object 來實現 Map 的功能,事實上 ES6 所引入的 Map 還是跟 Object 有所分別:

+ 所有 Object 物件的原型都會是 Object 的預設鍵 `Object.prototype`。可以使用 `map = Object.create(null)` 去創建一個沒有原型的 Object
+ Object 的鍵只可以是字符串(String),但 Map 的鍵可以是原始數據 ([Primitive](https://developer.mozilla.org/en-US/docs/Glossary/Primitive)) 或 Object。
+ Map 的迭代是根據 insertion order,而 Object 的迭代並沒有規範。
+ Map 新增了許多額外方法,例如計算有多少對鍵值,從前需要 `Object.keys(myObj).length`,現在則有 `Map.prototype.size`。

###[WeakMap](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap)
WeakMap 都是簡單的鍵/值(key/value)對應表,但鍵只可以是 Object 型別,例如:

```javascript
var wm1 = new WeakMap(),
    k1 = {},
    k2 = function () {},
    k3 = undefined;

wm1.set(k1,3);
wm1.get(k1); // 3
wm1.set(k2,4);
wm1.get(k2); // 4
wm1.get(k3); // undefined
```

###[Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)
如果說 Map 類似 Object, 那麼也可以用 Array 去實作 Set, 但 Set 值不能重複亦不能直接提取某個位置的值,只可以知道有沒有這個值,如需要知道所有值則使用 forEach 迭代。

```javascript
var s1 = new Set();
s1.add(1);
s1.add(5);
// Set { 1,5 }
```
但加入 Object 需要小心,可以看看以下例子
```javascript
var s1 = new Set();
s1.add({c:3});
s1.add({c:3});
// Set { { c: 3 }, { c: 3 } }
```

這樣的話就會看似是重覆了,建議先賦值後加入,又或者使用 Map 去代替。

```javascript
var s1 = new Set();
var o = { c: 3 };
s1.add(o);
s1.add(o);
// Set { { c: 3 } }
var s2 = new Set();
var m1 = new Map();
m1.set('c',3);
s2.add(m1);
// Set { Map { 'c' => 3 } }
```

###[WeakSet](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakSet)
WeakSet 的限制跟 WeakMap 一樣,只可以加入 Object 值而不能是原始數據 (只有 `{}` 以及 `function () {}`), 為何是 Weak, 因為 WeakSet 裡面所存儲的值都是被弱引用,所以如果沒有其他變量引用該值的話,就不能避免被回收掉 (garbage collection)。

```javascript
var ws = new WeakSet();
ws.add({c:3});
ws.add(function(){});
```

###[Typed Arrays](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Typed_arrays)
向來 JavaScript 處理 Binary Data 都比較麻煩, Typed arrays 的出現就能夠使代碼快速處理這些數據。詳細代碼可以參照[這裡](http://www.2ality.com/2015/09/typed-arrays.html)

###[Generator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*)
Generator 是一種函數,而這一種函數可以中途離開,下一次進入的時候則會載入上一次離開時的狀態(變量)。跟函數不同的是當調用 Generator 的時候,是返回一個 iterator, 當執行這個 `iterator.next()` 的時候才會執行 Generator 所定義的函數直至第一個 `yield`, `yield` 定義了所 return 的值。以下是一個訂單編號產生器:

```javascript
function * orderIndexGenerator () {
  var index = 1;
  var startDay = new Date().toISOString().substring(0, 10);
  while (true) {
    let today = new Date().toISOString().substring(0, 10);
    // 如果下一次呼叫 .next() 時候已經過了一天的話,就需要更新預設值,那就確保每一天的訂單都會從 1 開始
    if (startDay !== today) {
      startDay = today;
      index = 1;
    }
    yield startDay + '-' + index++;
  }
}
var oig = new oderIndexGenerator();
console.log(oig.next().value); // 2015-09-28-1
console.log(oig.next().value); // 2015-09-28-2
console.log(oig.next().value); // 2015-09-28-3
// 下一天再執行
console.log(oig.next().value); // 2015-09-29-1
```

###[Binary and Octal grammar](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Lexical_grammar#Numeric_literals)
創建二進制數字的語法需要加上一個 leading zero, (0b 或 0B)。如果 0b 或 0B 後面的不是 0 或 1, 編譯時就會出現 `SyntaxError` 的錯誤。

```javascript
var binaryNum = 0b3; // SyntaxError: Unexpected token ILLEGAL
```

同樣地創建八進制數字的語法需要加上一個 leading zero, (0o 或 0O)。如果 0o 或 0O 後面的不是 0,1,2,3,4,5,6,7, 編譯時就會出現 `SyntaxError` 的錯誤。

```javascript
var octNum = 0b8; // SyntaxError: Unexpected token ILLEGAL
```

###[Extension for Object Literal](https://github.com/lukehoban/es6features#enhanced-object-literals)
有經驗的開發者應該不難發現 ES6 的 Object 與先前提到的 class 十分相似,可以看看以下的代碼:

```javascript
var protoObject = { key: 'value' };
var obj = {
    __proto__: protoObject,
    findSuperKey () {
        console.log(super.key); // 這裡的 super 就是指 __proto__
    }
};
```

換轉如果用 class 寫的話

```javascript
'use strict';
class protoObject {
  constructor () {
    this.key = 'value';
  }
}

class obj extends protoObject {
  constructor () {
    super();
  }
  findSuperKey () {
    console.log(this.key);
  }
}

var o = new obj();
o.findSuperKey; // 'value'
```

另外 ES6 提供了一個快捷的[方法](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Lexical_grammar#Object_literals)去創建 Object, 就是如果當 Object key 的名稱跟變數的名稱是一樣的話,就可以縮短 Object 的代碼長度,減少冗餘。

```javascript
// ES6 的語法糖
var a = 'apple', b = 'boy', c = 'cat';
var childrenVocab = {a, b, c};
// 以前的寫法
var a = 'apple', b = 'boy', c = 'cat';
var childrenVocab = { a: a, b: b, c: c };
```
Object 的鍵名也可以動態加入,不一定用 static string 來表示, 使代碼更容易擴展
```javascript
var obj = {
  [(function(){return 'dymKey'})()] : 'dymKeyValue'
};
// { dymKey: 'dymKeyValue' }
```

###[New String methods](https://developer.mozilla.org/en-US/docs/Web/JavaScript/New_in_JavaScript/ECMAScript_6_support_in_Mozilla#Additions_to_the_String_object)

```javascript
String.prototype.codePointAt
String.prototype.normalize
String.prototype.repeat
String.prototype.startsWith
String.prototype.endsWith
String.prototype.includes
String.prototype[Symbol.iterator]
// static methods
String.raw
String.fromCodePoint
```

###[Symbols](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol)
Symbol 是 ES6 所定義的第七種 JavaScript 基本類型,是一種不可變的數據型別,是對原始數據的封裝。

```javascript
// 1. 基本應用,封裝原始數據,支援 typeof
var s = Symbol();
var s = Symbol('foo');
var s = Symbol(12);
var s = Symbol({ a: 1 });
typeof Symbol(); // 'symbol'

// 2. 使用 new 語法會拋出 TypeError 錯誤
var s = new Symbol(); // TypeError

// 3. 不能轉換成 string, number 或使用 JSON.stringify
var s = Symbol('foo');
s + 0; // TypeError: Cannot convert a Symbol value to a number
s + 'foo'; // TypeError: Cannot convert a Symbol value to a string

// 4. 每次創建都是新的
Symbol('foo') === Symbol('foo'); // false

// 5. 能夠封裝成 String
String(Symbol('foo')); // 'Symbol(foo)'

// 6. 可以用作 Object 的 key
var obj = {};
var sym = Symbol();
obj[sym] = 1;
console.log(obj[sym]); // 1
// 為了避免與 string key 有衝突, .keys 以及 .getOwnPropertyNames 均不會訪問得到 Symbol key
Object.getOwnPropertyNames(obj); // []
Object.keys(obj); // []
Object.getOwnPropertySymbols(obj); // [ Symbol() ]

// 7. 註冊表
var symbol = Symbol.for('foo');
Symbol.for('foo') === symbol && Symbol.keyFor(symbol) === 'foo'; // true
```

實際應用場景可以看看[這裡](https://hacks.mozilla.org/2015/06/es6-in-depth-symbols/)

###[Template strings](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/template_strings)
簡單而言,這是一種語法糖,定義了多行字串(multi-lined string)的寫法,加入了以及加入標籤。

```javascript
// Before ES6
var ms = 'A new line is then inserted.\nI am in the new line!';
// ES6 syntax sugar
var ms = `A new line is then inserted.
I am in the new line!`

// 模板字符串
var a = 1;
var b = 1;
// Before ES6
console.log(a + ' + ' + b + ' equals to ' + (a+b));
// ES6
console.log(`${a} + ${b} equals to ${a+b}`);
```

不過這裡會衍生安全性問題,由於 `${...}` 的寫法可以訪問變量內容,所以不能夠直接用作處理用戶端的輸入。

###[Arrow Functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)
這並不是一種新的概念,這種匿名函數其實一直都在使用:

```javascript
// Before ES6
var helloTargets = ['Alice','Bob','Cindy'];
helloTargets.map(function(target){
  console.log('Hello ' + target);
});
// Hello Alice
// Hello Bob
// Hello Cindy

// ES6 的代碼變得更簡潔
var helloTargets = ['Alice', 'Bob', 'Cindy'];
helloTargets.map((target) => console.log('Hello ' + target));

// 第二個例子
var psyTest = age => doingTest(age);
var psyTest = (age) => doingTest(age);
// 用 age => 或 (age) => 都是一樣效果
var psyTest = age,job => doingTest(age,job); // SyntaxError: Unexpected token =>
var psyTest = (age,job) => doingTest(age,job);
// 如果沒有括號是有問題的，建議使用 (age) => 是為了方便日後代碼擴展
```

單從代碼去看或者會認為這只是一種語法糖而已，但事實卻不然。除了是匿名函數的實現之外，它還省卻了寫 `this` 的麻煩與迷思，因為已經預設作用域並非函數的本身，而是定義時所在的函數裡頭，簡單來說就是預設綁定了 `this`。

```javascript
// Before ES6
function mother(){
  this.isAngry = true;
  this.callSonToDoHouseWork(function (){
    if(this.isAngry){ // undefined
      this.shopping();
    }
  });
}

// 需要使用 bind 去解決這個問題
// ...
this.callSonToDoHouseWork((function (){
  if(this.isAngry){ // undefined
    this.shopping();
  }
}).bind(this));
// ...

// ES6 arrow function
function mother(){
  this.isAngry = true;
  this.callSonToDoHouseWork(() => {
    if(this.isAngry){ // true
      this.shopping();
    }
  });
}
```

###[Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
相信有寫過異步代碼 (Asynchronous) 的開發者對 Promise 應該不會陌生。它對於簡化代碼，解決 Callback hell， try/catch 無法抓到回調異常 (callback exception) 的問題的效果十分顯著。在先前的 Node.js 版本 (0.12) 已經有原生支持，當然還可以透過基於 [Prmoises/A+](https://promisesaplus.com/) 標準所開發的第三方框架去實作起來， (例如 [Q](https://github.com/kriskowal/q)， [bluebird](https://github.com/petkaantonov/bluebird) 等)。

ES6 所定義的 Promise 有 4 種狀態， 分別是 Pending(待定)， Fulfilled(成功完成)， Rejected(失敗)， Settled(已經完成/失敗)。

```javascript
// 基本語法
new Promise(function(resolve, reject) { ... });

// 例子
var p1 = new Promise(function(resolve, reject){
  resolve('finished'); // resolve 就是 fullfil promise !
});
var p2 = new Promise(function(resolve, reject){
  reject('exception p2'); // reject 就是 reject promise !
});

p1
.then(function(val){
  // .then 定義當 promise 被 fulfil 時應做什麼
  // 這個時候的狀態就是 settled
  console.log(val); // 'finished'
});

p2
.then(function(val){
  // 這個時候的狀態就是 settled
  console.log(val);
})
.catch(function(result){
  // 這個時候的狀態就是 settled
  // .catch 定義當 promise 被 reject 時應做什麼
  console.log(result); // 'exception p2'
});
```

除了 `.then`， `.catch` 外，還有 `.all` 以及 `.race` 的方法，這個文檔暫時只提供基本 Promise 的應用而已。

###[for...of loops](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of)
這是一個語法糖，類似 C# 裡面的 `foreach(var item in items)`。

```javascript
var i1 = [1,2,3];
for(var i of i1){
  console.log(i);
}
/*
1
2
3
*/
var i2 = 'abc';
for(var i of i2){
  console.log(i);
}
/*
a
b
c
*/
```

此外，for...of 迴圈還支援下列樣式

```javascript
// Generator instance
for(var i of (function*(){ yield 1; yield 2; yield 3; }())) { ... }
// Generic iterable
for(var i of global.__createIterableObject([1, 2, 3])) { ... }
// Generic iterable instance
for(var i of Object.create(global.__createIterableObject([1, 2, 3]))) { ... }
```

##結語
由於 ES6 剛發佈不久，不論前端或後端還是需要一定時間去調試和整合，大家可以去比較不同平台和瀏覽器目前的兼容性，這個文檔也會不停的更新。

##參考資料
+ [ECMAScript compatibility table](https://kangax.github.io/compat-table/es6/)
+ [ES6 in Node.js](https://nodejs.org/en/docs/es6/)
