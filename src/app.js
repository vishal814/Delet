const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes');
const notFoundHandler = require('./middleware/not-found');
const errorHandler = require('./middleware/error-handler');

function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use('/api/v1', apiRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

module.exports = createApp;
