import { Application } from "express-serve-static-core";
import * as path from 'path';
import * as Ejs from 'ejs';
import * as morgan from 'morgan';
import normalizePort, { Port } from './helpers/normalizePort';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';

const DEFAULT_PORT: string = '2222';

const setupEnvironment = (app: Application, express: any) => {
  const libDir: string = path.resolve(process.cwd(), 'node_modules');
  const viewsDir: string = path.resolve(process.cwd(), 'build/views');
  const port: Port = normalizePort(process.env.PORT || DEFAULT_PORT);

  app.use('/lib', express.static(libDir));
  app.use(cookieParser());
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.json());
  app.use(morgan('dev'));

  app.set('port', port);
  app.set('views', viewsDir);
  app.set('view engine', 'ejs');
  app.engine('ejs', Ejs.renderFile);


};

export default setupEnvironment;
