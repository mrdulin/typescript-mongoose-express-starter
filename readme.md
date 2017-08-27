__简介:__

* 功能：用户注册，登录，账号删除，发表/修改/删除文章(支持markdown编辑)，发表/删除评论
* 使用`ejs`拼模板，完全采用服务器端页面渲染，表单提交，页面重定向。前端只负责UI交互效果。
* 基于`cookie`和`sessionId`的用户认证方式
* 服务器端使用`connect-mongo`将`session`持久化到`MongoDB`中

__FAQ:__

* 查看当前数据库连接数
```bash
> var status = db.serverStatus()
> status.connections
{ "current" : 8, "available" : 5726, "totalCreated" : 37 }
```
