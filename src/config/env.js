const dotenv = require('dotenv');

dotenv.config();

const config = {
  port: Number(process.env.PORT) || 4000,
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/delet',
  logLevel: process.env.LOG_LEVEL || 'info'
};

module.exports = config;
