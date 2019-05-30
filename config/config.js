const path = require('path');
const rootPath = path.normalize(__dirname + '/..');
const env = process.env.NODE_ENV || 'development';

const config = {
  development: {
    root: rootPath,
    app: {
      name: 'metrobase'
    },
    port: process.env.PORT || 3007,
    db: 'mongodb://localhost/metrobase-development'
  },

  test: {
    root: rootPath,
    app: {
      name: 'metrobase'
    },
    port: process.env.PORT || 3007,
    db: 'mongodb://localhost/metrobase-test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'metrobase'
    },
    port: process.env.PORT || 3007,
    db: 'mongodb+srv://metrobase:V5WZfJXOEvI2mOTi@cluster0-28lin.gcp.mongodb.net/test?retryWrites=true'
  }
};

module.exports = config[env];
