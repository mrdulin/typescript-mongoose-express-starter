import * as express from 'express';
import { Application } from "express-serve-static-core";
import * as fs from 'fs';
import * as path from 'path';
import * as morgan from 'morgan';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import * as session from 'express-session';
import * as connectMongo from 'connect-mongo';
import flash = require('connect-flash');
import expressValidator = require('express-validator');
import * as Ejs from 'ejs';
import * as moment from 'moment';

import normalizePort, { Port } from './helpers/normalizePort';
import config from './config';
import mongoose from './db';

const setupEnvironment = (app: Application) => {
  const cwd: string = process.cwd();
  const publicDir: string = path.resolve(cwd, 'build/public');
  const libDir: string = path.resolve(cwd, 'node_modules');
  const viewsDir: string = path.resolve(cwd, 'build/views');
  const port: Port = normalizePort(process.env.PORT || config.DEFAULT_PORT);

  const MongoStore: connectMongo.MongoStoreFactory = connectMongo(session);
  const mongoStore: connectMongo.MongoStore = new MongoStore({
    autoReconnect: true,
    mongooseConnection: mongoose.connection
  });

  //设置模板全局变量
  Object.assign(app.locals, {
    blog: {
      title: config.TITLE,
      description: config.DESCRIPTION
    },
    moment
  });

  app.use('/lib', express.static(libDir));
  app.use('/public', express.static(publicDir));
  app.use(cookieParser(config.COOKIE_SECRET));
  app.use(session({
    secret: config.COOKIE_SECRET,
    cookie: {
      maxAge: config.MAX_AGE,
      domain: config.DOMAIN,
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

  //需要加在bodyParser中间件后面, express-validator使用body-parser访问参数
  app.use(expressValidator());
  app.use(flash());

  if (process.env.NODE_ENV === 'production') {
    const accessLogStream: fs.WriteStream = fs.createWriteStream(path.join(cwd, 'access.log'), { flags: 'a' });
    app.use(morgan('combined', { stream: accessLogStream }));
  } else {
    app.use(morgan('dev'));
  }

  app.set('port', port);
  app.set('views', viewsDir);
  app.set('view engine', 'ejs');
  app.engine('ejs', Ejs.renderFile);

};

export default setupEnvironment;
