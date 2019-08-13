import { Request, Response, NextFunction } from 'express';

export const notLogin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session!.user) {
    req.flash('error', '未登录');
    return res.redirect('/signin');
  }
  next();
};

export const login = (req: Request, res: Response, next: NextFunction) => {
  if (req.session!.user) {
    req.flash('erorr', '已登录');
    return res.redirect('back');
  }
  next();
};
