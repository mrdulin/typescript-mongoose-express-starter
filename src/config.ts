const config = {
  NODE_ENV: process.env.NODE_ENV || 'development',

  COOKIE_SECRET: '7WN67f36',
  MAX_AGE: 60 * 60 * 1000,

  MONGODB_USER: process.env.MONGODB_USER || 'test',
  MONGODB_PWD: process.env.MONGODB_PWD || 'test123',
  MONGODB_DB_NAME: process.env.MONGODB_DB_NAME || 'typescript-mongoose-express-starter',
  MONGODB_HOST: process.env.MONGODB_HOST || 'ds145093.mlab.com',
  MONGODB_PORT: process.env.MONGODB_PORT || '45093',

  PORT: process.env.PORT || '3000',
  HOST: process.env.HOST || 'localhost',
};

export default config;
