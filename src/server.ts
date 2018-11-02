import * as express from 'express';
import { Express, Request, Response, NextFunction } from 'express';
import * as http from 'http';

import setupEnv from './env';
import { routes } from './routes';

function buildHttpServer(options: any) {
  const { port } = options;
  const app: Express = express();
  const server: http.Server = http.createServer(app);

  setupEnv(app);

  server.listen(port);
  server.on('error', onError);
  server.on('listening', onListening);

  app.use((req: any, res, next) => {
    res.locals.user = req.session.user;
    res.locals.success = req.flash('success').toString();
    res.locals.error = req.flash('error').toString();
    next();
  });

  // -- routes start --
  routes(app);
  // -- routes end --

  // 404路由
  app.get('*', (req, res, next) => {
    const err: any = new Error('404 not found');
    err.status = 404;
    next(err);
  });

  // 错误处理函数,错误处理中心化
  app.use(function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
    res.status(err.status || 500);
    if (app.get('env') !== 'production') {
      console.log(err.message + '/n' + err.status + '/n' + err.stack);
      res.render('error', {
        message: err.message,
        error: err
      });
    }

    res.end('服务器出错喽~');
  });

  // 服务器启动错误
  function onError(error: any) {
    if (error.syscall !== 'listen') {
      throw error;
    }

    const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

    switch (error.code) {
      case 'EACCES':
        //https://stackoverflow.com/questions/9164915/node-js-eacces-error-when-listening-on-most-ports
        console.error(bind + '端口使用需要更高的用户权限');
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(bind + '端口被占用');
        process.exit(1);
        break;
      default:
        throw error;
    }
  }

  function onListening() {
    const addr = server.address();
    const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
    console.log('服务器已启动，监听端口: ' + bind);
  }
}

// 未捕获的异常处理
process.on('uncaughtException', function(err: any) {
  console.log(err.message + '/n' + err.status + '/n' + err.stack);
});

export { buildHttpServer };
