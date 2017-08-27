import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { IPost, Post } from './Post';
import { Comment } from '../models/Comment';

const { Schema, Types } = mongoose;
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

//Schema只是一种简单的抽象，用以描述模型的样子以及它是如何工作的。数据的交互发生在模型上，而不是Schema上。
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

userSchema.statics = {
  removeUserById(id: string) {
    const author = new Types.ObjectId(id);
    const arr: Array<Promise<any>> = [
      Post.find({ author }, '_id').remove().exec(),
      Comment.find({ author }, '_id').remove().exec(),
      User.findByIdAndRemove(id).exec()
    ];
    return Promise.all(arr);
  }
};

//注册模型
//Mongoose将集合名字设置为users, 除非我们通过第三个参数来指定集合名。Mongoose默认会对模型名字使用小写复数形式
//如下面的, 在数据库中会创建一个users集合
export const User = mongoose.model<IUser>('User', userSchema);

//随后想要获取模型，可以通过调用mongoose.model方法并提供模型名
// console.log(mongoose.model('User'));
