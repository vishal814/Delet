const HttpError = require('../utils/httpError');

function notFoundHandler(req, res, next) {
  next(new HttpError(404, 'Route not found.'));
}

module.exports = notFoundHandler;
