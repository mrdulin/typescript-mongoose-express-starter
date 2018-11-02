import mongoose from 'mongoose';

import config from './config';

const url: string = `mongodb://${config.MONGODB_USER}:${config.MONGODB_PWD}@${config.MONGODB_HOST}:${
  config.MONGODB_PORT
}/${config.MONGODB_DB_NAME}`;

function MongoConnect() {
  mongoose.connect(
    url,
    {
      useMongoClient: true
    }
  );

  mongoose.connection.on('connected', function() {
    console.log('已连接到数据库: ' + url);
  });

  mongoose.connection.on('error', function(err) {
    console.log('数据库连接失败: ' + err);
  });

  mongoose.connection.on('disconnected', function() {
    console.log('退出数据库连接');
  });

  process.on('SIGINT', function() {
    mongoose.connection.close(function() {
      console.log('程序停止运行，退出数据库连接');
      process.exit(0);
    });
  });
}

export { MongoConnect };
