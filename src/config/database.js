const mongoose = require('mongoose');
const config = require('./env');

mongoose.set('strictQuery', true);

async function connectToDatabase() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }
  return mongoose.connect(config.mongoUri, {
    serverSelectionTimeoutMS: 5000
  });
}

async function disconnectFromDatabase() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
}

module.exports = {
  connectToDatabase,
  disconnectFromDatabase
};
