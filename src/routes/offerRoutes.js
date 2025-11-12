const { Router } = require('express');
const { body, param, query } = require('express-validator');
const offerController = require('../controllers/offerController');
const validateRequest = require('../middleware/validateRequest');
const { authenticate } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');

const router = Router();

router.get(
  '/',
  [
    query('location').optional().isString(),
    query('remote').optional().isBoolean().toBoolean(),
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
    query('offset').optional().isInt({ min: 0 }).toInt(),
  ],
  validateRequest,
  offerController.listOffers
);

router.get(
  '/:id',
  [param('id').isInt().withMessage('El id debe ser numérico')],
  validateRequest,
  offerController.getOffer
);

router.post(
  '/',
  authenticate,
  requireRole('empresa'),
  [
    body('title').isString().withMessage('El título es obligatorio'),
    body('description').isString().withMessage('La descripción es obligatoria'),
    body('location').optional().isString(),
    body('salaryRange').optional().isString(),
    body('employmentType').optional().isString(),
    body('requirements').optional(),
    body('accessibilityFeatures').optional(),
    body('remoteAvailable').optional().isBoolean().toBoolean(),
  ],
  validateRequest,
  offerController.createOffer
);

router.put(
  '/:id',
  authenticate,
  requireRole('empresa'),
  [
    param('id').isInt(),
    body('title').optional().isString(),
    body('description').optional().isString(),
    body('location').optional().isString(),
    body('salaryRange').optional().isString(),
    body('employmentType').optional().isString(),
    body('requirements').optional(),
    body('accessibilityFeatures').optional(),
    body('remoteAvailable').optional().isBoolean().toBoolean(),
  ],
  validateRequest,
  offerController.updateOffer
);

router.delete(
  '/:id',
  authenticate,
  requireRole('empresa'),
  [param('id').isInt()],
  validateRequest,
  offerController.deleteOffer
);

module.exports = router;


