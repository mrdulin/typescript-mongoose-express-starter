import { Request, Response, NextFunction } from "express-serve-static-core";

export const notLoggedIn = (req: Request, res: Response, next: NextFunction) => {
  if (!req!.session!.user) {
    res.redirect('/mongoose-pm/user/login');
  }
  next();
};

