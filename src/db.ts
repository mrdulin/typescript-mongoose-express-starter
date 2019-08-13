import * as mongoose from 'mongoose';
import config from './config';

async function MongoConnect() {
  const url: string = `mongodb://${config.MONGODB_USER}:${config.MONGODB_PWD}@${config.MONGODB_HOST}:${
    config.MONGODB_PORT
  }/${config.MONGODB_DB_NAME}`;

  process.on('SIGINT', function() {
    mongoose.disconnect().then(() => {
      console.log('程序停止运行，退出数据库连接');
      process.exit(0);
    });
  });

  return mongoose
    .connect(url, { useNewUrlParser: true, useFindAndModify: false })
    .then(() => {
      console.log('已连接到数据库: ' + url);
    })
    .catch((error) => {
      console.log('数据库连接失败: ' + error);
    });
}

export { MongoConnect };
