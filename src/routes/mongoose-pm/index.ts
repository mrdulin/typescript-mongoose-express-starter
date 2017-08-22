import * as express from 'express';
import { Router, Express } from 'express-serve-static-core';
import * as path from 'path';
const router: Router = express.Router();
import projectRouter from './project';
import userRouter from './user';

const createRoutes = (app: Express): Router => {
  app.set('views', path.resolve(process.cwd(), 'build/views/mongoose-pm'));
  router.use('/project', projectRouter);
  router.use('/user', userRouter);

  router.get('/', (req, res) => {
    res.render('./');
  });

  return router;
};


export default createRoutes;
