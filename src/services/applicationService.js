const applicationModel = require('../models/applicationModel');
const offerModel = require('../models/offerModel');
const userModel = require('../models/userModel');

async function ensureCandidateRole(userId) {
  const user = await userModel.findById(userId);
  if (!user || user.role !== 'candidato') {
    const error = new Error('Acceso restringido a candidatos');
    error.status = 403;
    throw error;
  }
  return user;
}

async function createApplication(candidateId, { offerId, coverLetter }) {
  await ensureCandidateRole(candidateId);

  const offer = await offerModel.findById(offerId);
  if (!offer) {
    const error = new Error('Oferta no encontrada');
    error.status = 404;
    throw error;
  }

  if (offer.companyId === candidateId) {
    const error = new Error('No puedes postularte a tu propia oferta');
    error.status = 400;
    throw error;
  }

  return applicationModel.createApplication({
    offerId,
    candidateId,
    coverLetter,
  });
}

async function listApplicationsForCandidate(candidateId) {
  await ensureCandidateRole(candidateId);
  return applicationModel.listByCandidate(candidateId);
}

async function listApplicantsForOffer(companyId, offerId) {
  const offer = await offerModel.findById(offerId);
  if (!offer || offer.companyId !== companyId) {
    const error = new Error('Oferta no encontrada o sin permisos');
    error.status = 404;
    throw error;
  }

  return applicationModel.listApplicantsByOffer(offerId);
}

module.exports = {
  createApplication,
  listApplicationsForCandidate,
  listApplicantsForOffer,
};


