import * as express from 'express';
import { Router, Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import { Result } from 'express-validator';
// import { loginCheck } from '../middlewares';

const router: Router = express.Router();

router
  .get('/', (req: Request, res: Response) => {
    res.render('signup');
  });

router
  .post('/', (req: Request, res: Response, next: NextFunction) => {
    const { username: name, email, password } = req.body;
    const now: number = Date.now();

    req.checkBody({
      username: {
        notEmpty: true,
        isLength: {
          options: [{ min: 4, max: 20 }],
          errorMessage: '用户名必须大于4个字符，小于20个字符'
        },
        errorMessage: '无效的用户名'
      },
      password: {
        notEmpty: true,
        isLength: {
          options: [{ min: 3, max: 20 }],
          errorMessage: '密码必须大于3个字符，小于20个字符'
        },
        errorMessage: '无效的密码'
      },
      email: {
        notEmpty: true,
        isEmail: {
          errorMessage: '无效的邮箱'
        }
      }
    });

    req.sanitize('username').escape().trim();

    req.getValidationResult().then((result: Result) => {
      console.log('validation result: ', result);
    });

    new User({ name, email, password, modifiedOn: now, lastLogin: now })
      .save((err, user) => {
        if (err) {
          if (err.code === 11000) {
            req.flash('error', '用户名已被占用');
            res.redirect('/signup');
          }
          next(err);
        } else {
          delete user.password;
          req.session!.user = user;

          User.update({ _id: user.id }, { $set: { lastLogin: Date.now() } }, () => {
            res.redirect('/posts');
          });
        }
      });
  });

export default router;
