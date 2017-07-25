import * as express from 'express';
import {Express, Request, Response} from "express-serve-static-core";
import * as http from 'http';
import { Port } from './helpers/normalizePort';
import setupEnv from './env';

const app: core.Express = express();
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
// -- routes end --

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
  console.log('Listening on ' + bind);
}
