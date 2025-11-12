const authService = require('../services/authService');

async function register(req, res, next) {
  try {
    const user = await authService.registerUser(req.body);
    const token = authService.generateToken(user);
    res.status(201).json({ success: true, data: { user, token } });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const result = await authService.loginUser(req.body);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

async function profile(req, res, next) {
  try {
    const user = await authService.getUserProfile(req.user.id);
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  register,
  login,
  profile,
};


