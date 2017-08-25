import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { IUser } from './User';
import { IPost } from './Post';
const { Schema } = mongoose;

export interface IComment extends Document {
  author: IUser;
  post: IPost;
  content: string;
  created_at: number;
}

const commentSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: 'Post'
  },
  content: String,
  created_at: {
    type: Date,
    default: Date.now()
  }
});

export const Comment = mongoose.model<IComment>('Comment', commentSchema);
