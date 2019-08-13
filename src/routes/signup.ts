import * as express from 'express';
import { Router, Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import { login } from '../middlewares';
import { Result } from 'express-validator/check';

const router: Router = express.Router();

router.get('/', login, (req: Request, res: Response) => {
  res.render('signup');
});

router.post('/', login, (req: Request, res: Response, next: NextFunction) => {
  req.checkBody({
    username: {
      notEmpty: true,
      isLength: {
        options: [{ min: 4, max: 20 }],
        errorMessage: '用户名必须大于4个字符，小于20个字符',
      },
      errorMessage: '无效的用户名',
    },
    password: {
      notEmpty: true,
      isLength: {
        options: [{ min: 3, max: 20 }],
        errorMessage: '密码必须大于3个字符，小于20个字符',
      },
      errorMessage: '无效的密码',
    },
  });

  if (req.body.password !== req.body.repassword) {
    req.flash('error', '两次输入的密码不一致');
    return res.redirect('back');
  }

  req.sanitize('username').trim();
  req.sanitize('password').trim();

  req.getValidationResult().then((result: Result) => {
    if (result.isEmpty()) {
      const now: number = Date.now();
      const { username, password } = req.body;

      new User({ username, password, modifiedOn: now, lastLogin: now }).save((err, user) => {
        if (err) {
          if (err.code === 11000) {
            req.flash('error', '用户名已被占用');
            res.redirect('/signup');
          }
          next(err);
        } else {
          req.flash('success', '注册成功');
          //TODO: 从user中删除password字段
          req.session!.user = user;

          User.update({ _id: user.id }, { $set: { lastLogin: Date.now() } }, () => {
            res.redirect('/posts');
          });
        }
      });
    } else {
      const errors = result.array();
      req.flash('error', errors[0].msg);
      res.redirect('back');
    }
  });
});

export default router;
