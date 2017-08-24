import * as express from 'express';
import { Router, Request, Response } from 'express';
// import { loginCheck } from '../middlewares';

const router: Router = express.Router();

router
  .get('/', (req: Request, res: Response) => {
    req.session!.destroy(() => {
      res.redirect('/signin');
    });
  });

export default router;
