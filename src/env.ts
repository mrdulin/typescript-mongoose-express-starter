import { Application } from "express-serve-static-core";
import * as path from 'path';
import * as morgan from 'morgan';
import normalizePort, { Port } from './helpers/normalizePort';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import * as session from 'express-session';

import credential from './credential';

const DEFAULT_PORT: string = '2222';

const setupEnvironment = (app: Application, express: any) => {
  const publicDir: string = path.resolve(process.cwd(), 'build/public');
  const libDir: string = path.resolve(process.cwd(), 'node_modules');
  const viewsDir: string = path.resolve(process.cwd(), 'build/views');
  const port: Port = normalizePort(process.env.PORT || DEFAULT_PORT);

  app.use('/lib', express.static(libDir));
  app.use('/public', express.static(publicDir));
  app.use(cookieParser(credential.cookieSecret));
  app.use(session({
    secret: credential.cookieSecret,
    cookie: {
      maxAge: 60 * 1000,
      domain: 'localhost',
      httpOnly: true,
      path: '/'
    },
    name: 'tmes.sid',
    resave: false,
    saveUninitialized: false,
    store: new session.MemoryStore()
  }));
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.json());
  app.use(morgan('dev'));

  app.set('port', port);
  app.set('views', viewsDir);
  app.set('view engine', 'jade');

};

export default setupEnvironment;
