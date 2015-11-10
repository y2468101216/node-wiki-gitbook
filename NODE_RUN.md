# 前言

當你把程式寫好遠端部署在VPS上，就會碰到一個問題：如何使程式永不中斷的運行？你會發現當你關掉vps的遠端連線後程式就掛了。
你需要pm2，不要再用forever。

# 安裝 pm2

安裝pm2

```
$ npm install pm2 -g
```

# 永續執行一隻app

```
$ pm2 start yourapp.js
```

現在即使你關掉了遠端連線他也會持續運轉

* option

如果你想要更新code後會自動restart的話，請使用

```
$ pm2 start yourapp.js --watch 
```

他會監看該程式底下的所有目錄，如果有更新會立即restart。

# 模擬多線程(實驗階段)

javascript本身是單線程的，如果要多線程必須要寫code，聽起來就很麻煩，幸好pm2可以幫我們解決這個問題。

```
$ pm2 start yourapp.js -i 3
```

這樣就會直接啟動三個yourapp.js。

* 注意

因為是多線程，請保證你的session改用redis。

當然效果跟多開yourapp.js是相似的

# 部署

厭煩了每次都要遠端連上vps用git作部署？pm2可以給你十分良好的部署體驗。

在你的專案根目錄底下新增一個ecosystem.json

```json
{
  "apps": [
    {
      "name": "scriptname",//pm2裡顯示的服務名稱
      "script": "start.js"//實際要執行的js檔
    }
  ],
  "deploy": {
    "production": {
      "key": "yousshKey",//ssh key 給pm2遠端連線vps部署用
      "user": "youraccount",//遠端登入的帳號
      "host": "212.83.163.1",//遠端連線的IP
      "ref": "origin/master",//使用哪個git branch
      "repo": "git@github.com:repo.git",//git網址
      "path": "/var/www/production",//部署目錄
      "post-deploy": "sudo npm install && sudo pm2 startOrRestart ecosystem.json"//遠端需要執行的指令
    }
  }
}
```

先下setup指令部署目錄
```
$ pm2 deploy ecosystem.json production setup
```

之後再部署code

```
$ pm2 deploy ecosystem.json production
```

他就會自動安裝ndoe_module跟運行code，之後如果要更新code只需運行

```
$ pm2 deploy ecosystem.json production
```

# 重開機

有的時候你需要將server重開，但是你不想要一個一個將pm2的程式start，你可以下以下指令：


這會建立pm2的開機程式

```
$ pm2 startup
```

這會儲存pm2現在運行了哪些程式，供下次開機執行

```
$ pm2 save
```

你可以放心重開機了。

# 結語

pm2還有許多延伸，比如查看記憶體使用狀態，reload。有興趣的人可以參考官網研究一下。

# 參考資料

* pm2:<http://pm2.keymetrics.io>