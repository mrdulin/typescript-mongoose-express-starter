import { Request, Response, Router, NextFunction } from 'express';
import { User } from '../models/User';
// import { loginCheck } from '../middlewares';
import { Result } from 'express-validator';

export class UserController {
  constructor() { }

  public initialize(router: Router) {

    router.route('/signup')
      .get(this.renderSignupPage)
      .post(this.signup);

    // router.route('/edit')
    //   .get(this.renderEditPage)
    //   .post(this.edit);

    // router.route('/delete')
    //   .get(this.renderDeletePage)
    //   .post(this.delete);

    router.route('/signin')
      .get(this.renderSigninPage)
      .post(this.signin);

    router.get('/signout', this.signout);

    return router;
  }

  /**
   * 用户注册页
   *
   * @param {Request} req
   * @param {Response} res
   * @memberof UserController
   */
  public renderSignupPage(req: Request, res: Response) {
    res.render('signup');
  }

  /**
   * 用户提交注册表单
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @memberof UserController
   */
  public signup(req: Request, res: Response, next: NextFunction) {
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
          console.log('err: ' + err);
          if (err.code === 11000) {
            console.log('用户已经存在');
            res.redirect('../user/new?exists=true');
          } else {
            //TODO: err: ValidationError: password: Path `password` is required., name: username must be gt 4 characters
            res.redirect('../user/new?error=true');
          }
        } else {
          console.log('user is: ' + user);
          req.session!.user = user;
          User.update({ _id: user.id }, { $set: { lastLogin: Date.now() } }, () => {
            res.redirect('../user');
          });
        }
      });
  }

  /**
   * 用户信息编辑页
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns
   * @memberof UserController
   */
  public renderEditPage(req: Request, res: Response, next: NextFunction) {
    const { user } = req.session!;

    if (user) {
      return res.render('user-edit', {
        title: '编辑用户信息',
        _id: user._id,
        name: user.name,
        email: user.email,
        buttonText: '保存'
      });
    }

    req.session!.destroy(() => res.redirect('../user/login'));

  }

  /**
   * 用户提交编辑表单
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @memberof UserController
   */
  public edit(req: Request, res: Response, next: NextFunction) {
    const user = req.session!.user;

    if (user._id) {
      User.findById(user._id, (err, userFound) => {
        if (err) {
          console.log(err);
          return res.redirect('../user?error=finding');
        }

        if (userFound) {
          const { username, email } = req.body;

          userFound.username = username;
          userFound.email = email;
          userFound.modifiedOn = Date.now();

          userFound.save((error, userSaved) => {
            if (error) return next(error);
            console.log('User updated: ' + username);
            req.session!.user = userSaved;
            res.redirect('../user');
          });
        } else {
          res.redirect('../user');
        }
      });
    }
  }

  /**
   * 用户账号删除页
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns
   * @memberof UserController
   */
  public renderDeletePage(req: Request, res: Response, next: NextFunction) {
    const user = req.session!.user;

    if (user) {
      return res.render('user-delete-form', {
        title: '删除账号',
        username: user.name,
        _id: user._id,
        email: user.email
      });
    }

    req.session!.destroy(() => res.redirect('../user/login'));
  }

  /**
   * 用户账户删除提交
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @memberof UserController
   */
  // public delete(req: Request, res: Response, next: NextFunction) {
  //   const _id: string = req.body._id;

  //   if (_id) {
  //     User.findByIdAndRemove({ _id }, (err, user) => {
  //       if (err) {
  //         console.log(err);
  //         return res.redirect('../user?error=deleting');
  //       }

  //       if (user) {
  //         console.log('User deleted: ', user);
  //         Project.remove({ createdBy: user }, (error) => {
  //           if (error) return next(error);
  //           req.session!.destroy(() => res.redirect('../user/login'));
  //         });
  //       } else {
  //         req.session!.destroy(() => res.redirect('../user/login'));
  //       }

  //     });
  //   }
  // }

  /**
   * 登录页
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @memberof UserController
   */
  public renderSigninPage(req: Request, res: Response, next: NextFunction) {
    res.render('login', { title: '登录' });
  }

  /**
   * 登陆页提交
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @memberof UserController
   */
  public signin(req: Request, res: Response, next: NextFunction) {



  }

  /**
   * 退出登录
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @memberof UserController
   */
  public signout(req: Request, res: Response, next: NextFunction) {
    req.session!.destroy(() => {
      res.redirect('login');
    });
  }

}
