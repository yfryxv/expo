const offerModel = require('../models/offerModel');
const userModel = require('../models/userModel');

function normalizeList(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.map((item) => item.toString().toLowerCase());
  if (typeof value === 'string') {
    return value
      .split(',')
      .map((item) => item.trim().toLowerCase())
      .filter(Boolean);
  }
  return [];
}

function scoreOffer(offer, candidateSkills) {
  const requirements = normalizeList(offer.requirements);
  if (!requirements.length || !candidateSkills.length) {
    return 0;
  }

  const matches = requirements.filter((req) => candidateSkills.some((skill) => req.includes(skill)));
  return matches.length;
}

async function recommendOffers(candidateId) {
  const user = await userModel.findById(candidateId);
  if (!user) {
    const error = new Error('Usuario no encontrado');
    error.status = 404;
    throw error;
  }

  const candidateSkills = normalizeList(user.skills);

  const offers = await offerModel.listOffers({});

  const scored = offers
    .filter((offer) => offer.companyId !== candidateId)
    .map((offer) => ({
      offer,
      score: scoreOffer(offer, candidateSkills),
    }))
    .sort((a, b) => b.score - a.score || new Date(b.offer.createdAt) - new Date(a.offer.createdAt))
    .slice(0, 5)
    .map(({ offer, score }) => ({
      ...offer,
      matchScore: score,
    }));

  return scored;
}

module.exports = {
  recommendOffers,
};


