const recommendationService = require('../services/recommendationService');

async function recommend(req, res, next) {
  try {
    const recommendations = await recommendationService.recommendOffers(req.user.id);
    res.json({ success: true, data: recommendations });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  recommend,
};


