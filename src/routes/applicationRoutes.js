const { Router } = require('express');
const { body, param } = require('express-validator');
const applicationController = require('../controllers/applicationController');
const validateRequest = require('../middleware/validateRequest');
const { authenticate } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');

const router = Router();

router.post(
  '/',
  authenticate,
  requireRole('candidato'),
  [
    body('offerId').isInt().withMessage('El id de la oferta es obligatorio'),
    body('coverLetter').optional().isString(),
  ],
  validateRequest,
  applicationController.createApplication
);

router.get(
  '/mis',
  authenticate,
  requireRole('candidato'),
  applicationController.listMyApplications
);

router.get(
  '/oferta/:offerId',
  authenticate,
  requireRole('empresa'),
  [param('offerId').isInt()],
  validateRequest,
  applicationController.listApplicants
);

module.exports = router;


