import mongoose = require('mongoose');
import config from './config';

const dbURI: string = config.dbURI;

mongoose.Promise = global.Promise;

mongoose.connect(dbURI, {
  useMongoClient: true
});

mongoose.connection.on('connected', function () {
  console.log('已连接到数据库: ' + dbURI);
});

mongoose.connection.on('error', function (err) {
  console.log('数据库连接失败: ' + err);
});

mongoose.connection.on('disconnected', function () {
  console.log('退出数据库连接');
});

process.on('SIGINT', function () {
  mongoose.connection.close(function () {
    console.log('程序停止运行，退出数据库连接');
    process.exit(0);
  });
});
