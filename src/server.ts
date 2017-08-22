import * as express from 'express';
import { Express, Request, Response, NextFunction } from "express-serve-static-core";
import * as http from 'http';
import { Port } from './helpers/normalizePort';
import setupEnv from './env';
require('./db');

import mongoosePM from './routes/mongoose-pm';

const app: Express = express();
setupEnv(app, express);

const port: Port = app.get('port');
const server: http.Server = http.createServer(app);

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

// -- routes start --
app.get('/', (req: Request, res: Response) => {
  res.render('index');
});
app.use('/mongoose-pm', mongoosePM(app));
// -- routes end --

// 404路由
app.get('*', (req, res, next) => {
  const err: any = new Error('404 not found');
  err.status = 404;
  next(err);
});

// 404错误处理中间件
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err.status !== 404) {
    return next();
  }
  res.status(404).send(err.message);
});

//
process.on('uncaughtException', function (err) {
  console.error(err);
});

function onError(error: any) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  console.log('服务器已启动，监听端口: ' + bind);
}
