import { Request, Response, Router, NextFunction } from 'express';
import { User, IUser } from '../../models/mongoose-pm/User';
import { Project } from '../../models/mongoose-pm/Project';

export class UserController {
  constructor() {}

  public initialize(router: Router) {
    router.get('/', this.renderHomePage);

    router.route('/new')
      .get(this.renderRegisterPage)
      .post(this.register);

    router.route('/edit')
      .get(this.renderEditPage)
      .post(this.edit);

    router.route('/delete')
      .get(this.renderDeletePage)
      .post(this.delete);

    router.route('/login')
      .get(this.renderLoginPage)
      .post(this.login);

    router.get('/logout', this.logout);

    return router;
  }

  /**
   * 用户登录后首页
   *
   * @param {Request} req
   * @param {Response} res
   * @returns {void}
   * @memberof UserController
   */
  public renderHomePage(req: Request, res: Response): void {
    const { user } = req.session!;

    if (user) {
      return res.render('mongoose-pm/user-page', {
        title: user.name,
        name: user.name,
        email: user.email,
        userId: user._id
      });
    }

    req.session!.destroy(() => res.redirect('/mongoose-pm/user/login'));
  }

  /**
   * 用户注册页
   *
   * @param {Request} req
   * @param {Response} res
   * @memberof UserController
   */
  public renderRegisterPage(req: Request, res: Response) {
    res.render('mongoose-pm/user-edit', {
      title: '注册用户',
      name: '',
      email: '',
      buttonText: "注册"
    });
  }

  /**
   * 用户提交注册表单
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @memberof UserController
   */
  public register(req: Request, res: Response, next: NextFunction) {
    const { username: name, email, password } = req.body;
    const now: number = Date.now();

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
          // res.cookie('user', user);
          // res.cookie('logined', true);
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
      return res.render('mongoose-pm/user-edit', {
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

          userFound.name = username;
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
      return res.render('mongoose-pm/user-delete-form', {
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
  public delete(req: Request, res: Response, next: NextFunction) {
    const _id: string = req.body._id;

    if (_id) {
      User.findByIdAndRemove({ _id }, (err, user) => {
        if (err) {
          console.log(err);
          return res.redirect('../user?error=deleting');
        }

        if (user) {
          console.log('User deleted: ', user);
          Project.remove({ createdBy: user }, (error) => {
            if (error) return next(error);
            req.session!.destroy(() => res.redirect('../user/login'));
          });
        } else {
          req.session!.destroy(() => res.redirect('../user/login'));
        }

      });
    }
  }

  /**
   * 登录页
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @memberof UserController
   */
  public renderLoginPage(req: Request, res: Response, next: NextFunction) {
    res.render('mongoose-pm/login', { title: '登录' });
  }

  /**
   * 登陆页提交
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @memberof UserController
   */
  public login(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;

    if (email) {
      User.findOne({ email }, 'email name _id password').exec((err: any, user: IUser) => {
        if (err) res.redirect('?404=error');

        if (user && user.password === password) {
          console.log('logined user is: ', user);
          req.session!.user = user;
          res.redirect('../user');
        } else {
          res.redirect('?404=error');
        }

      });
    } else {
      res.redirect('?404=error');
    }
  }

  /**
   * 退出登录
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @memberof UserController
   */
  public logout(req: Request, res: Response, next: NextFunction) {
    req.session!.destroy(() => {
      res.redirect('login');
    });
  }

}
