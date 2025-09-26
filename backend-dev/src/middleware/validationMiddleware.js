const { validationResult } = require('express-validator');

/**
 * Validate the request body.
 * @param {import('express').Request} req The request object.
 * @param {import('express').Response} res The response object.
 * @param {import('express').NextFunction} next The next middleware function.
 */
module.exports = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};