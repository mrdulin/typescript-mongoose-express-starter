import { Express, Request, Response } from 'express';
import signin from './signin';
import signup from './signup';
import signout from './signout';
import posts from './posts';

export const routes = (app: Express) => {
  app.get('/', (req: Request, res: Response) => {
    res.redirect('/posts');
  });
  app.use('/signin', signin);
  app.use('/signup', signup);
  app.use('/signout', signout);
  app.use('/posts', posts);

};
