/**
 * Created by Administrator on 2016/4/12.
 */
var mongoose = require('mongoose');

var taskSchema = new mongoose.Schema({
    taskName: {
        type: String,
        required: true,
        validate: validateLength
    }
});

var validateLength = [];
