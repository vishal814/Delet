const HttpError = require('../utils/httpError');

function mapMongooseError(err) {
  if (err.name === 'CastError') {
    return new HttpError(400, 'Invalid identifier.');
  }
  if (err.name === 'ValidationError') {
    return new HttpError(422, err.message);
  }
  return null;
}

function errorHandler(err, req, res, next) { // eslint-disable-line
  let error = err;
  if (!(error instanceof HttpError)) {
    const mapped = mapMongooseError(error);
    error = mapped || new HttpError(500, 'Unexpected error.');
    if (error.statusCode === 500) {
      console.error(err); // basic logging for MVP
    }
  }

  res.status(error.statusCode).json({
    error: {
      message: error.message
    }
  });
}

module.exports = errorHandler;
