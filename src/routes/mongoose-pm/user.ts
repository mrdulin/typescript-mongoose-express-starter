import * as express from 'express';
import { Router } from 'express-serve-static-core';
import { User } from '../../models/mongoose-pm/User';
import { Project } from '../../models/mongoose-pm/Project';
const router: Router = express.Router();

router
  /**
   * 用户登录后首页
   */
  .get('/', (req, res, next) => {
    const { user, logined } = req.cookies;

    if (logined) {
      res.render('user-page', {
        title: user.name,
        name: user.name,
        email: user.email,
        userId: user._id
      });
    } else {
      res.redirect('login');
    }
  });

router
  .route('/new')
  /**
   * 用户注册页
   */
  .get((req, res, next) => {
    res.render('user-edit', {
      title: '注册用户',
      name: '',
      email: '',
      buttonText: "注册"
    });
  })
  /**
   * 用户注册页提交
   */
  .post((req, res, next) => {
    const { username: name, email } = req.body;
    const now: number = Date.now();

    new User({ name, email, modifiedOn: now, lastLogin: now })
      .save((err, user) => {
        if (err) {
          console.log('err: ' + err);
          if (err.code === 11000) {
            res.redirect('../user/new?exists=true');
          } else {
            res.redirect('../?error=true');
          }
        } else {
          console.log('user is: ' + user);
          res.cookie('user', user);
          res.cookie('logined', true);
          User.update({ _id: user.id }, { $set: { lastLogin: Date.now() } }, () => {
            res.redirect('../user');
          });
        }
      });
  });

router
  .route('/edit')
  /**
   * 用户信息编辑页
   */
  .get((req, res, next) => {
    const { user, logined } = req.cookies;

    if (logined) {
      res.render('user-edit', {
        title: '编辑用户信息',
        _id: user._id,
        name: user.name,
        email: user.email,
        buttonText: '保存'
      });
    }
    res.redirect('../user/login');
  })

  /**
   * 用户信息编辑页保存
   */
  .post((req, res, next) => {
    const user = req.cookies.user;
    if (user._id) {
      User.findById(user._id, (err, userFound) => {
        if (err) {
          console.log(err);
          res.redirect('../user?error=finding');
        }

        if (userFound) {
          const { username, email } = req.body;

          userFound.name = username;
          userFound.email = email;
          userFound.modifiedOn = Date.now();

          userFound.save((error, userSaved) => {
            if (error) return next(error);
            console.log('User updated: ' + username);
            res.cookie('user', userSaved);
            res.redirect('../user');
          });
        }

        res.redirect('../user');
      });
    }
  });

router
  .route('/delete')
  /**
   * 账号删除页面
   */
  .get((req, res, next) => {
    const user = req.cookies.user;
    if (user) {

      res.render('user-delete-form', {
        title: '删除账号',
        username: user.name,
        _id: user._id,
        email: user.email
      });
    }

    res.redirect('../user/login');

  })

  /**
   * 账号删除提交
   */
  .post((req, res, next) => {
    if (req.body._id) {
      User.findByIdAndRemove({ _id: req.body._id }, (err, user) => {
        if (err) {
          console.log(err);
          res.redirect('../user?error=deleting');
        } else {
          if (user) {
            console.log('User deleted: ', user);
            Project.remove({ createdBy: user._id }, (error) => {
              if (error) return next(error);
              res.clearCookie('user');
              res.clearCookie('logined');
              res.redirect('../user/login');
            });
          }
        }
      });
    }
  });

router
  .route('/login')
  /**
   * 用户登录页
   */
  .get((req, res, next) => {
    res.render('login', { title: '登录' });
  })
  /**
   * 用户登录提交
   */
  .post((req, res, next) => {
    const email: string = req.body.email;
    if (email) {
      User.findOne({ email }, 'email name _id').exec((err, user) => {
        if (err) {
          res.redirect('?404=error');
        } else {
          if (user) {
            console.log('logined user is: ', user);
            res.cookie('user', user);
            res.cookie('logined', true);
            res.redirect('../user');
          }
          res.redirect('?404=error');
        }
      });
    } else {
      res.redirect('?404=error');
    }
  });

router
  /**
   * 退出登录
   */
  .get('/logout', (req, res) => {
    res.clearCookie('user');
    res.clearCookie('logined');
    res.redirect('login');
  });


export default router;
