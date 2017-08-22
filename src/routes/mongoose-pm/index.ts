import * as express from 'express';
import { Router } from 'express-serve-static-core';
const router: Router = express.Router();
import projectRouter from './project';

router.use('/project', projectRouter);
router.use('/user', require('./user'));

router.get('/', (req, res) => {
  res.render('./mongoose-pm/index.jade');
});

export default router;
