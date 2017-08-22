import * as mongoose from 'mongoose';

const talidateLength = [];

const TaskSchema = new mongoose.Schema({
  taskName: {
    type: String,
    required: true,
    validate: talidateLength
  }
});

