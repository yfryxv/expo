const { Router } = require('express');
const authRoutes = require('./userRoutes');
const offerRoutes = require('./offerRoutes');
const applicationRoutes = require('./applicationRoutes');
const recommendationRoutes = require('./recommendationRoutes');

const router = Router();

router.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

router.use('/usuarios', authRoutes);
router.use('/ofertas', offerRoutes);
router.use('/postulaciones', applicationRoutes);
router.use('/recomendaciones', recommendationRoutes);

module.exports = router;


