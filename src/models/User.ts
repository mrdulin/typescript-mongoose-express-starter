import * as mongoose from 'mongoose';

export interface IUser extends mongoose.Document {
  username: string;
  password: string;
  email: string;
  createdOn: number;
  modifiedOn: number;
  lastLogin: number;
}

const UserSchema = new mongoose.Schema({
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
  password: {
    type: String,
    trim: true,
    required: true,
    minlength: [3, '密码必须大于3个字符']
  },
  email: {
    type: String,
    trim: true,
    required: true
  },
  createdOn: {
    type: Date,
    default: Date.now()
  },
  modifiedOn: Date,
  lastLogin: Date
});

export const User = mongoose.model<IUser>('User', UserSchema);
