import * as express from 'express';
import { Router, Request, Response, NextFunction } from 'express';
import { User } from '../models/User';

import { notLogin } from '../middlewares/loginCheck';

const router: Router = express.Router();

router.get('/delete', notLogin, (req: Request, res: Response) => {
  res.render('user-delete');
});

/**
 * 删除账号
 *
 * 删除该账号相关的文章和评论
 */
router.post('/delete', notLogin, (req: Request, res: Response, next: NextFunction) => {
  const id: string = req.session.user._id;

  User.schema.statics
    .removeUserById(id)
    .then(() => {
      req.session.destroy(() => {
        // session销毁后，不能再使用req.flash，否则会报错Error: req.flash() requires sessions
        // req.flash('success', '删除成功');
        res.redirect('/posts');
      });
    })
    .catch((err: Error) => {
      //TODO: 测试
      req.flash('error', '删除账号失败，请稍后再试');
      res.redirect('back');
    });
});

export default router;
