function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      const error = new Error('No tienes permisos para realizar esta acción');
      error.status = 403;
      return next(error);
    }
    return next();
  };
}

module.exports = {
  requireRole,
};


