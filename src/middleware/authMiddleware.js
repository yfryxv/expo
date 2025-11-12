const jwt = require('jsonwebtoken');
const config = require('../config/env');
const userModel = require('../models/userModel');

async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      const error = new Error('Token de autenticación requerido');
      error.status = 401;
      throw error;
    }

    const token = authHeader.split(' ')[1];
    const payload = jwt.verify(token, config.jwtSecret);

    const user = await userModel.findById(payload.sub);
    if (!user) {
      const error = new Error('Usuario no encontrado');
      error.status = 401;
      throw error;
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError') {
      error.status = 401;
      error.message = 'Token inválido o expirado';
    }
    next(error);
  }
}

module.exports = {
  authenticate,
};


