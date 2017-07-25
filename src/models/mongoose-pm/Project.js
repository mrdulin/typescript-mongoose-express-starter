/**
 * Created by Administrator on 2016/4/11.
 */
var mongoose = require('mongoose');

var projectSchema = new mongoose.Schema({
    projectName: String,
    createdOn: {
        type: Date,
        'default': Date.now()
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
projectSchema.statics = {
    findByUserId: findByUserId,
    findById: findById
};

function findByUserId(id, cb) {
    return this.find({createdBy: id}, '_id projectName', {sort: 'modifiedOn'}, cb);
}

function findById(id, cb) {
    return this.findOne({_id: id}, null, {sort: 'createdOn'}, cb);
}

var project = mongoose.model('Project', projectSchema);

module.exports = project;