import * as mongoose from 'mongoose';
import * as marked from 'marked';
import { Document } from 'mongoose';
import { IUser } from './User';
import { Comment, IComment } from './Comment';
const { Schema } = mongoose;

export interface IPost extends Document {
  _id: string;
  author: IUser;
  comments: IComment[];
  title: string;
  content: string;
  created_at: number;
  pv: number;
  commentsCount: number;
}

const postSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
    },
  ],
  title: String,
  content: String,
  created_at: {
    type: Date,
    default: Date.now(),
  },
  pv: {
    type: Number,
    default: 0,
  },
  commentsCount: {
    type: Number,
    default: 0,
  },
});

postSchema.methods = {
  convertMarkdownToHtml(): string {
    return marked(this.content);
  },
};

postSchema.statics = {
  setCommentsCount(posts: IPost[]) {
    return Promise.all(
      posts.map((post: IPost) => {
        return Comment.schema.statics.getCountByPostId(post._id).then((count: number) => {
          post.commentsCount = count;
          return post;
        });
      }),
    );
  },
};

export const Post = mongoose.model<IPost>('Post', postSchema);
