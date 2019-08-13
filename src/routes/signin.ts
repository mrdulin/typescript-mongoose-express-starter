import * as express from 'express';
import { Router, Request, Response, NextFunction } from 'express';
import { User, IUser } from '../models/User';
import { login } from '../middlewares';
import { Result } from 'express-validator/check';

const router: Router = express.Router();

router.get('/', login, (req: Request, res: Response) => {
  res.render('signin');
});

/**
 * 登录表单提交，使用express-validator中间件进行参数校验，消毒
 */
router.post('/', login, (req: Request, res: Response, next: NextFunction) => {
  req.checkBody({
    username: {
      notEmpty: true,
      errorMessage: '无效的用户名',
    },
    password: {
      notEmpty: true,
      isLength: {
        options: [{ min: 3 }],
        errorMessage: '密码必须大于3位字符',
      },
      errorMessage: '无效的密码',
    },
  });

  req.sanitizeBody('username').trim();
  req.sanitizeBody('password').trim();

  req.getValidationResult().then((result: Result) => {
    if (result.isEmpty()) {
      const { username, password } = req.body;
      User.findOne({ username }, '_id name password')
        .exec()
        .then((user: IUser) => {
          if (!user) {
            req.flash('error', '用户不存在');
            return res.redirect('back');
          }

          user.comparePassword(password, (err: Error, same?: boolean) => {
            if (err) return next(err);
            if (!same) {
              req.flash('error', '密码错误');
              return res.redirect('back');
            } else {
              req.session!.user = user;
              res.redirect('/posts');
            }
          });
        })
        .catch(next);
    } else {
      const error = result.array();
      req.flash('error', error[0].msg);
      res.redirect('back');
    }
  });
});

export default router;
