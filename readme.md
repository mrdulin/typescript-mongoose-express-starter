__FAQ:__

* 查看当前数据库连接数
```bash
> var status = db.serverStatus()
> status.connections
{ "current" : 8, "available" : 5726, "totalCreated" : 37 }
```
