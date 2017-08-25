import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { IPost } from './Post';

const { Schema } = mongoose;
const SALT_WORD_FACTOR: number = 10;

export interface IUser extends Document, IMethods {
  _id: string;
  username: string;
  password: string;
  email: string;
  createdOn: number;
  modifiedOn: number;
  lastLogin: number;
  posts: IPost;
}

interface IMethods {
  comparePassword: (password: string, cb: ComparePasswordCallback) => void;
}

type ComparePasswordCallback = (err: Error, same?: boolean) => void;

const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    validate: {
      validator: (name: string): boolean => name.length > 4,
      msg: '用户名必须大于4个字符'
    }
  },
  gender: String,
  password: {
    type: String,
    trim: true,
    required: true,
    minlength: [3, '密码必须大于3个字符']
  },
  email: {
    type: String,
    trim: true
  },
  bio: {
    type: String,
    trim: true
  },
  createdOn: {
    type: Date,
    default: Date.now()
  },
  modifiedOn: Date,
  lastLogin: Date,

  posts: [{
    type: Schema.Types.ObjectId,
    ref: 'Post'
  }]
});

userSchema.pre('save', function (next) {
  const user: IUser = this;
  if (!user.isModified('password')) return next();

  bcrypt.genSalt(SALT_WORD_FACTOR)
    .then((salt: string) => {
      return bcrypt.hash(user.password, salt).then((encrypted: string) => {
        user.password = encrypted;
        next();
      });
    })
    .catch(next);
});

userSchema.methods.comparePassword = function (password: string, cb: ComparePasswordCallback) {
  const user: IUser = this;
  bcrypt.compare(password, user.password)
    .then((same: boolean) => cb(null, same))
    .catch(cb);
};

export const User = mongoose.model<IUser>('User', userSchema);
