const logger = require('../logger');

/**
 * Log errors to a file.
 * @param {Error} err The error object.
 * @param {import('express').Request} req The request object.
 * @param {import('express').Response} res The response object.
 * @param {import('express').NextFunction} next The next middleware function.
 */

module.exports = (err, req, res, next) => {
  logger.error(err.message, { metadata: err });
  res.status(500).send('Something failed.');
};