import * as mongoose from 'mongoose';

export interface IProject extends mongoose.Document {
  projectName: string;
  createdOn: string;
  modifiedOn: number;
  createdBy: any;
  contributors: any[];
  tasks: string;
}

const ProjectSchema = new mongoose.Schema({
  projectName: String,
  createdOn: {
    type: Date,
    default: Date.now()
  },
  modifiedOn: Date,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  contributors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  tasks: String
});

//静态方法statics关键字，Project调用
//实例方法methods关键字，new Project({...})出来的实例调用
//静态方法必须在schema声明之后，mongoose.model编译之前定义，否则会提示xxx is not a function
ProjectSchema.statics = {
  findByUserId,
  findById
};

export const Project = mongoose.model<IProject>('Project', ProjectSchema);

function findByUserId(id: number, cb: () => void) {
  return Project.find({ createdBy: id }, '_id projectName', { sort: 'modifiedOn' }, cb);
}

function findById(id: number, cb: () => void) {
  return Project.findOne({ _id: id }, {}, { sort: 'createdOn' }, cb);
}


