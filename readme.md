__简介:__

* 功能：用户注册，登录，账号删除，发表/修改/删除文章(支持markdown编辑)，发表/删除评论
* 使用`ejs`拼模板，完全采用服务器端页面渲染，表单提交，页面重定向。前端只负责UI交互效果。
* 基于`cookie`和`sessionId`的用户认证方式
* 服务器端使用`connect-mongo`将`session`持久化到`MongoDB`中

__使用方式：__

* `mongod --auth`
* 新开终端窗口, `yarn run build:w`开启`webpack`监视模式，编译源代码
* 新开终端窗口, `yarn run serve`，使用`nodemon`运行并监视编译后`build/server.js`文件

__关于调试：__

* 在`vscode`的`launch.json`文件中添加配置
* 直接在`ts`源码中打断点，而不是在编译后的文件，程序以调试模式运行后（尽管运行的是编译后的文件，但是由于生成了`sourcemap`文件），断点的位置会映射到源文件中。

__FAQ:__

* 查看当前数据库连接数
```bash
> var status = db.serverStatus()
> status.connections
{ "current" : 8, "available" : 5726, "totalCreated" : 37 }
```

* `MongoDB`用户权限管理

掌握权限，理解下面4条基本上就差不多

1. MongoDB是没有默认管理员账号，所以要先添加管理员账号，再开启权限认证。
2. 切换到admin数据库，添加的账号才是管理员账号。
3. 用户只能在用户所在数据库登录，包括管理员账号。
4. 管理员可以管理所有数据库，但是不能直接管理其他数据库，要先在admin数据库认证后才可以。

* 开启`MongoDB`用户权限

`mongod --auth`
