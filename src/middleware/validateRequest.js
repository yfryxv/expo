const { validationResult } = require('express-validator');

function validateRequest(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Errores de validación');
    error.status = 422;
    error.details = errors.array();
    return next(error);
  }
  return next();
}

module.exports = validateRequest;


