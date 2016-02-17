import path from 'path';
const rootPath = path.normalize(__dirname + '/..');
const env = process.env.NODE_ENV || 'development';

const config = {
  development: {
    root: rootPath,
    pagination: {
      defaultSize: 20,
      maxSize: 100,
    },
    app: {
      name: 'wind',
    },
    port: 8000,
    mongo: 'mongodb://localhost/wind-cms',
    sessionSecret: 'wind-dev',
    redis: {
      host: '127.0.0.1',
      port: 6379,
      db: 0,
    },
    accessLog: false,
    apiRoot: 'http://123.57.72.210:9002/dtp/',
    cookieSecret: 'dsfljkasdjfklsdajfkl',
    rsa: {
      encoding: 'base64',
      privatePem: 'server.pem',
      charset: 'utf8',
    },
    cookieExpire: 7 * 24 * 3600 * 1000, // 7天
    cookieDomain: '.learnwithwind.com',
  },

  test: {
    root: rootPath,
    pagination: {
      defaultSize: 20,
      maxSize: 100,
    },
    app: {
      name: 'wind',
    },
    port: 8001,
    mongo: 'mongodb://localhost/wind-cms',
    sessionSecret: 'wind-dev',
    redis: {
      host: '127.0.0.1',
      port: 6379,
      db: 0,
    },
    accessLog: true,
    apiRoot: 'http://123.57.72.210:9002/dtp/',
    cookieSecret: 'dsfljkasdjfklsdajfkl',
    rsa: {
      encoding: 'base64',
      privatePem: 'server.pem',
      charset: 'utf8',
    },
    cookieExpire: 7 * 24 * 3600 * 1000, // 7天
    cookieDomain: '.learnwithwind.com',
  },

  production: {
    root: rootPath,
    pagination: {
      defaultSize: 20,
      maxSize: 100,
    },
    app: {
      name: 'wind',
    },
    port: 8002,
    mongo: 'mongodb://localhost/wind-cms',
    sessionSecret: 'wind-prod',
    redis: {
      host: '127.0.0.1',
      port: 6379,
      db: 1,
    },
    accessLog: true,
    apiRoot: 'http://123.57.72.210:9002/dtp/',
    cookieSecret: 'dsfljkasdjfklsdajfkl',
    rsa: {
      encoding: 'base64',
      privatePem: 'server.pem',
      charset: 'utf8',
    },
    cookieExpire: 7 * 24 * 3600 * 1000, // 7天
    cookieDomain: '.learnwithwind.com',
  },
};

export default config[env];
