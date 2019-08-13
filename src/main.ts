import { MongoConnect } from './db';
import { buildHttpServer } from './server';
import config from './config';

(async function main() {
  await MongoConnect();
  buildHttpServer({
    port: config.PORT,
  });
})();
