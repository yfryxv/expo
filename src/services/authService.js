const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const { hashPassword, comparePasswords } = require('../utils/password');
const config = require('../config/env');

async function registerUser(payload) {
  const existing = await userModel.findByEmail(payload.email);
  if (existing) {
    const error = new Error('El correo electrónico ya está registrado');
    error.status = 409;
    throw error;
  }

  const passwordHash = await hashPassword(payload.password);

  const user = await userModel.createUser({
    fullName: payload.fullName,
    email: payload.email,
    passwordHash,
    role: payload.role,
    companyName: payload.companyName || null,
    profileSummary: payload.profileSummary || null,
    skills: payload.skills || null,
    accessibilityNeeds: payload.accessibilityNeeds || null,
  });

  return user;
}

function generateToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      role: user.role,
    },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn }
  );
}

async function loginUser({ email, password }) {
  const result = await userModel.findByEmailWithPassword(email);
  if (!result) {
    const error = new Error('Credenciales inválidas');
    error.status = 401;
    throw error;
  }

  const { user, passwordHash } = result;
  const isValid = await comparePasswords(password, passwordHash);

  if (!isValid) {
    const error = new Error('Credenciales inválidas');
    error.status = 401;
    throw error;
  }

  const token = generateToken(user);

  return { user, token };
}

async function getUserProfile(userId) {
  const user = await userModel.findById(userId);
  if (!user) {
    const error = new Error('Usuario no encontrado');
    error.status = 404;
    throw error;
  }
  return user;
}

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  generateToken,
};


