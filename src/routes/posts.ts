import * as express from 'express';
import { Router, Request, Response } from 'express';
// import { Result, MappedError } from 'express-validator';
// import { loginCheck } from '../middlewares';

const router: Router = express.Router();

router
  .get('/', (req: Request, res: Response) => {
    res.render('posts');
  });


export default router;
