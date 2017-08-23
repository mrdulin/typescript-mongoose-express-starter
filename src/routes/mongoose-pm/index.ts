import * as express from 'express';
import { Router, Express } from 'express-serve-static-core';
const router: Router = express.Router();
import projectRouter from './project';
import userRouter from './user';

const createRoutes = (app: Express): Router => {
  router.use('/project', projectRouter);
  router.use('/user', userRouter);

  router.get('/', (req, res) => {
    res.render('./');
  });

  return router;
};


export default createRoutes;
