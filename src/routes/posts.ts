import * as express from 'express';
import { Router, Request, Response, NextFunction } from 'express';
import { Post, IPost } from '../models/Post';
import { Comment, IComment } from '../models/Comment';
import { Result, MappedError } from 'express-validator';
import { Types } from 'mongoose';
import { notLogin } from '../middlewares/loginCheck';

const router: Router = express.Router();

function postValidator(req: Request, res: Response, next: NextFunction) {
  req.checkBody({
    title: {
      notEmpty: true,
      errorMessage: '标题不能为空'
    },
    content: {
      notEmpty: true,
      errorMessage: '文章内容不能为空'
    }
  });

  req.sanitize('title').escape().trim();
  req.sanitize('content').escape().trim();

  req.getValidationResult().then((result: Result) => {
    if (result.isEmpty()) {
      next();
    } else {
      const error: MappedError[] = result.array();
      req.flash('error', error[0].msg);
      res.redirect('back');
    }
  });
}

router
  .get('/', (req: Request, res: Response, next: NextFunction) => {
    const author: string = req.query.author;
    const conditions: any = {};
    if (author) {
      conditions.author = new Types.ObjectId(author);
    }

    Post
      .find(conditions)
      .exec()
      .then((posts: IPost[]) => {
        res.render('posts', { posts });
      })
      .catch(next);

  });

/**
 * 发表新文章页面
 */
router
  .get('/create', (req: Request, res: Response) => {
    res.render('create');
  });

/**
 * 发表文章 - 提交
 */
router
  .post('/', postValidator, (req: Request, res: Response, next: NextFunction) => {
    // TODO:
    // if not use express-validator middleware, how to use mongoose schema build-in validator to validate the form data.
    // And, distinguish each type of error, catch the error in router(controller), so I can use my custom error message in the view.
    const { title, content } = req.body;
    const author: string = req.session.user._id;
    const post: IPost = new Post({ title, content, author });

    post.save()
      .then((postSaved: IPost) => {
        req.flash('success', '发表成功');
        res.redirect(`/posts/${postSaved._id}`);
      })
      .catch(next);
  });

/**
 * 通过文章id获取文章
 */
router
  .get('/:postId', (req: Request, res: Response, next: NextFunction) => {
    const postId: string = req.params.postId;

    const queryPromises: Array<Promise<any>> = [
      // Post.findById(postId).populate('author', '_id username gender bio').exec(),
      Post.findOneAndUpdate({ _id: new Types.ObjectId(postId) }, { $inc: { pv: 1 } }, { new: true })
        .populate('author', '_id username gender bio').exec(),
      Comment.find({ post: new Types.ObjectId(postId) }).populate('author').exec()
    ];

    Promise.all(queryPromises.map((query: Promise<any>): Promise<any> => query.catch((err: any) => err)))
      .then((result: any[]) => {
        const post: IPost = result[0];
        //TODO: 如果comment数据查询出错，错误处理
        const comments: IComment[] = result[1];

        if (!post) {
          req.flash('error', '文章不存在');
          return res.redirect('back');
        }

        console.log('result', post);

        res.render('post', { post, comments });

      })
      .catch(next);
  });

/**
 * 编辑文章页面
 */
router
  .get('/:postId/edit', notLogin, (req: Request, res: Response, next: NextFunction) => {
    const postId: string = req.params.postId;
    const author: string = req.session.user._id;

    Post
      .findOne({
        _id: new Types.ObjectId(postId),
        author: new Types.ObjectId(author)
      })
      .populate('author', '_id')
      .exec()
      .then((post: IPost) => {
        if (!post) {
          throw new Error('文章不存在');
        }
        if (author.toString() !== post.author._id.toString()) {
          throw new Error('权限不足');
        }

        res.render('edit', { post });
      })
      .catch(next);

  });

/**
 * 编辑文章页面 - 提交
 */
router
  .post('/:postId/edit', notLogin, postValidator, (req: Request, res: Response, next: NextFunction) => {

    const { title, content } = req.body;
    const author: string = req.session.user._id;
    const postId: string = req.params.postId;

    Post.findOneAndUpdate({
      author: new Types.ObjectId(author),
      _id: new Types.ObjectId(postId)
    }, { title, content })
      .exec()
      .then((post: IPost) => {
        req.flash('success', '编辑文章成功');
        res.redirect(`/posts/${post._id}`);
      })
      .catch(next);

  });

router
  .get('/:postId/remove', notLogin, (req: Request, res: Response, next: NextFunction) => {
    const author: string = req.session.user._id;
    const postId: string = req.params.postId;

    Post.findOneAndRemove({
      author: new Types.ObjectId(author),
      _id: new Types.ObjectId(postId)
    })
      .exec()
      .then(() => {
        req.flash('success', '删除成功');
        res.redirect('/posts');
      })
      .catch(next);

  });

/**
 * 提交留言
 */
router
  .post('/:postId/comment', notLogin, (req: Request, res: Response, next: NextFunction) => {

    req.checkBody('content', '留言内容为空').notEmpty();
    req.sanitize('content').escape().trim();

    req.getValidationResult().then((result: Result) => {
      if (result.isEmpty()) {
        const content: string = req.body.content;
        const author: string = req.session.user._id;
        const post: string = req.params.postId;
        const comment: IComment = new Comment({ content, post, author });

        comment.save().then((commentSaved: IComment) => {
          req.flash('success', '留言成功');
          res.redirect('back');
        }).catch(next);

      } else {
        const error: MappedError[] = result.array();
        req.flash('error', error[0].msg);
        res.redirect('back');
      }
    }).catch(next);

  });

/**
 * 删除留言
 */
router
  .get('/:postId/comment/:commentId/remove', notLogin, (req: Request, res: Response, next: NextFunction) => {
    const author: string = req.session.user._id;
    const commentId: string = req.params.commentId;

    Comment
      .findOneAndRemove({
        _id: new Types.ObjectId(commentId),
        author: new Types.ObjectId(author)
      })
      .exec()
      .then(() => {
        req.flash('success', '删除留言成功');
        res.redirect('back');
      })
      .catch(next);

  });

export default router;
