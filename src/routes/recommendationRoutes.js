const { Router } = require('express');
const recommendationController = require('../controllers/recommendationController');
const { authenticate } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');

const router = Router();

router.get('/', authenticate, requireRole('candidato'), recommendationController.recommend);

module.exports = router;


