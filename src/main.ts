import { MongoConnect } from './db';
import { buildHttpServer } from './server';
import config from './config';

function main() {
  MongoConnect();
  buildHttpServer({
    port: config.PORT
  });
}

main();
