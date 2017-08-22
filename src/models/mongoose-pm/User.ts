import * as mongoose from 'mongoose';

interface IUser extends mongoose.Document {
  name: string;
  email: string;
  createdOn: number;
  modifiedOn: number;
  lastLogin: number;
}

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    validate: { validator: nameLengthValidator, msg: 'username must be gt 4 characters' }
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  createdOn: {
    type: Date,
    default: Date.now()
  },
  modifiedOn: Date,
  lastLogin: Date
});

UserSchema.statics = {
  findById
};

export const User = mongoose.model<IUser>('PM-User', UserSchema);

function findById(id: number, cb: () => void) {
  return User.findOne({ _id: id }, cb);
}

function nameLengthValidator(name: string): boolean {
  return name.length > 4;
}
