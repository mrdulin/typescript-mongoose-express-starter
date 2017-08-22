import * as express from 'express';
import { Router } from 'express-serve-static-core';
import { User } from '../../models/mongoose-pm/User';
import { Project } from '../../models/mongoose-pm/Project';
const router: Router = express.Router();

router
  .get('/', (req, res, next) => {
    const user = req.cookies.user;
    const isLogined = req.cookies.logined;
    if (isLogined) {
      res.render('./mongoose-pm/user_page.jade', {
        title: user.name,
        name: user.name,
        email: user.email,
        userId: user._id
      });
    } else {
      res.redirect('/mongoose-pm/login');
    }
  });

router
  .route('/new')
  .get((req, res, next) => {
    res.render('./mongoose-pm/user_form.jade', {
      title: 'Create user',
      name: '',
      email: '',
      buttonText: "Join!"
    });
  })
  .post((req, res, next) => {
    new User({
      name: req.body.username,
      email: req.body.email,
      modifiedOn: Date.now(),
      lastLogin: Date.now()
    }).save(function (err, user) {
      if (err) {
        console.log('err: ' + err);
        if (err.code === 11000) {
          res.redirect('/mongoose-pm/user/new?exists=true');
        } else {
          res.redirect('/mongoose-pm/?error=true');
        }
      } else {
        console.log('user is: ' + user);
        res.cookie('user', user);
        res.cookie('logined', true);
        User.update({ _id: user.id }, { $set: { lastLogin: Date.now() } }, function () {
          res.redirect('/mongoose-pm/user');
        });
      }
    });
  });

router
  .route('/edit')
  .get((req, res, next) => {
    const user = req.cookies.user;
    const isLogin = req.cookies.logined;

    if (isLogin) {
      res.render('./mongoose-pm/user_form.jade', {
        title: 'Edit user',
        _id: user._id,
        name: user.name,
        email: user.email,
        buttonText: 'Save'
      });
    } else {
      res.redirect('/mongoose-pm/login.jade');
    }
  })
  .post(function editUser(req, res, next) {
    if (req.cookies.user._id) {
      User.findById(req.cookies.user._id, function (err, user) {
        if (err) {
          console.log(err);
          res.redirect('/mongoose-pm/user?error=finding');
        } else {
          user.name = req.body.username;
          user.email = req.body.email;
          user.modifiedOn = Date.now();
          user.save(function (error, userSaved) {
            if (error) return next(error);
            console.log('User updated: ' + req.body.username);
            res.cookie('user', userSaved);
            res.redirect('/mongoose-pm/user');
          });
        }
      });
    }
  });

router
  .route('/delete')
  .get(function renderDeleteUser(req, res, next) {
    res.render('./mongoose-pm/user_delete_form.jade', {
      title: 'Delete account',
      username: req.cookies.user.name,
      _id: req.cookies.user._id,
      email: req.cookies.user.email
    });
  })
  .post(function deleteUser(req, res, next) {
    if (req.body._id) {
      User.findByIdAndRemove({ _id: req.body._id }, function (err, user) {
        if (err) {
          console.log(err);
          res.redirect('/mongoose-pm/user?error=deleting');
        } else {
          console.log('User deleted: ', user);
          Project.remove({ createdBy: user._id }, (error) => {
            if (error) {
              console.log(err);
            } else {
              res.clearCookie('user', 'logined');
              res.redirect('/mongoose-pm/user');
            }
          });
        }
      });
    }
  });

router
  .route('/login')
  .get(function renderLogin(req, res, next) {
    res.render('./mongoose-pm/login.jade', {
      title: 'Log in'
    });
  })
  .post(function login(req, res, next) {
    const email: string = req.body.email;
    if (email) {
      User.findOne({ email }, 'email name _id').exec(function (err, user) {
        if (err) {
          res.redirect('/mongoose-pm/user/login?404=error');
        } else {
          if (user) {
            console.log('logined user is: ', user);
            res.cookie('user', user);
            res.cookie('logined', true);
            res.redirect('/mongoose-pm/user');
          } else {
            res.redirect('/mongoose-pm/user/login?404=error');
          }
        }
      });
    } else {
      res.redirect('/mongoose-pm/login?404=error')
    }
  });

router
  .post('/logout', function logout(req, res, next) {
  });

module.exports = router;
