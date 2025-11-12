const { Router } = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const validateRequest = require('../middleware/validateRequest');
const { authenticate } = require('../middleware/authMiddleware');

const router = Router();

router.post(
  '/registro',
  [
    body('fullName').isString().withMessage('El nombre completo es requerido'),
    body('email').isEmail().withMessage('Correo electrónico inválido'),
    body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
    body('role')
      .isIn(['empresa', 'candidato'])
      .withMessage('El rol debe ser "empresa" o "candidato"'),
    body('companyName')
      .if(body('role').equals('empresa'))
      .notEmpty()
      .withMessage('El nombre de la empresa es obligatorio para roles de empresa'),
  ],
  validateRequest,
  authController.register
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Correo electrónico inválido'),
    body('password').notEmpty().withMessage('La contraseña es obligatoria'),
  ],
  validateRequest,
  authController.login
);

router.get('/perfil', authenticate, authController.profile);

module.exports = router;


