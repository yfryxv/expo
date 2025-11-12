const offerModel = require('../models/offerModel');
const userModel = require('../models/userModel');

async function ensureCompanyRole(userId) {
  const user = await userModel.findById(userId);
  if (!user || user.role !== 'empresa') {
    const error = new Error('Acceso restringido a empresas');
    error.status = 403;
    throw error;
  }
  return user;
}

async function ensureOfferOwnership(offerId, companyId) {
  const offer = await offerModel.findByIdAndCompany(offerId, companyId);
  if (!offer) {
    const error = new Error('Oferta no encontrada o sin permisos');
    error.status = 404;
    throw error;
  }
  return offer;
}

async function createOffer(companyId, data) {
  await ensureCompanyRole(companyId);

  return offerModel.createOffer({
    companyId,
    title: data.title,
    description: data.description,
    location: data.location,
    salaryRange: data.salaryRange,
    employmentType: data.employmentType,
    requirements: data.requirements,
    accessibilityFeatures: data.accessibilityFeatures,
    remoteAvailable: data.remoteAvailable,
  });
}

async function listOffers(filters) {
  return offerModel.listOffers(filters);
}

async function getOfferById(id) {
  const offer = await offerModel.findById(id);
  if (!offer) {
    const error = new Error('Oferta no encontrada');
    error.status = 404;
    throw error;
  }
  return offer;
}

async function updateOffer(companyId, offerId, data) {
  await ensureOfferOwnership(offerId, companyId);
  return offerModel.updateOffer(offerId, companyId, data);
}

async function deleteOffer(companyId, offerId) {
  await ensureOfferOwnership(offerId, companyId);
  await offerModel.deleteOffer(offerId, companyId);
}

module.exports = {
  createOffer,
  listOffers,
  getOfferById,
  updateOffer,
  deleteOffer,
};


