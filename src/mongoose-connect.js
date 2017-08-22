/**
 * Created by Administrator on 2016/4/11.
 */
var mongoose = require('mongoose');

var dbURI = 'mongodb://localhost:27017/TrainingMEN';

mongoose.connect(dbURI);

mongoose.connection.on('connected', function () {
  console.log('Mongoose connect to ' + dbURI);
});

mongoose.connection.on('error', function (err) {
  console.log('Mongoose connection error: ' + err);
});

mongoose.connection.on('disconnected', function () {
  console.log('Mongoose disconnected');
});

process.on('SIGINT', function () {
  mongoose.connection.close(function () {
    console.log('Mongoose disconnected through app termination');
    process.exit(0);
  });
});
