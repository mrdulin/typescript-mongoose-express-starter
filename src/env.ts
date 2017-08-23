import * as express from 'express';
import { Application } from "express-serve-static-core";
import * as path from 'path';
import * as morgan from 'morgan';
import normalizePort, { Port } from './helpers/normalizePort';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import * as session from 'express-session';
import * as connectMongo from 'connect-mongo';
import config from './config';

const DEFAULT_PORT: string = '2222';

const setupEnvironment = (app: Application) => {
  const cwd: string = process.cwd();
  const publicDir: string = path.resolve(cwd, 'build/public');
  const libDir: string = path.resolve(cwd, 'node_modules');
  const viewsDir: string = path.resolve(cwd, 'build/views');
  const port: Port = normalizePort(process.env.PORT || DEFAULT_PORT);

  const MongoStore: connectMongo.MongoStoreFactory = connectMongo(session);
  const mongoStore: connectMongo.MongoStore = new MongoStore({
    url: config.dbURI,
    autoReconnect: true
  });

  app.use('/lib', express.static(libDir));
  app.use('/public', express.static(publicDir));
  app.use(cookieParser(config.cookieSecret));
  app.use(session({
    secret: config.cookieSecret,
    cookie: {
      maxAge: 20 * 1000,
      domain: 'localhost',
      httpOnly: true,
      path: '/'
    },
    name: 'tmes.sid',
    resave: false,
    saveUninitialized: false,
    // store: new session.MemoryStore()
    store: mongoStore
  }));
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(morgan('dev'));

  app.set('port', port);
  app.set('views', viewsDir);
  app.set('view engine', 'jade');

};

export default setupEnvironment;
