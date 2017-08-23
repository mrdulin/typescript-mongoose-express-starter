import * as express from 'express';
import { Router, Express } from 'express-serve-static-core';
const router: Router = express.Router();
import projectRouter from './project';
// import userRouter from './user';
import { UserController } from './user-v2';

const createRoutes = (app: Express): Router => {
  router.use((req: any, res, next) => {
    res.locals.user = req.session.user;
    if (req.session.views) {
      req.session.views++;
      console.log('views: ' + req.session.views);
    } else {
      req.session.views = 1;
    }
    next();
  });

  router.use('/project', projectRouter);
  router.use('/user', new UserController().initialize(router));

  router.get('/', (req, res) => {
    res.render('./');
  });

  return router;
};


export default createRoutes;
