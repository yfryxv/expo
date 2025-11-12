const offerService = require('../services/offerService');

async function listOffers(req, res, next) {
  try {
    const { location, remote, limit, offset } = req.query;
    const filters = {
      location,
      limit,
      offset,
    };

    if (typeof remote !== 'undefined') {
      filters.remote = ['true', '1', 'yes', 'on'].includes(String(remote).toLowerCase());
    }

    const offers = await offerService.listOffers(filters);
    res.json({ success: true, data: offers });
  } catch (error) {
    next(error);
  }
}

async function getOffer(req, res, next) {
  try {
    const offer = await offerService.getOfferById(Number(req.params.id));
    res.json({ success: true, data: offer });
  } catch (error) {
    next(error);
  }
}

async function createOffer(req, res, next) {
  try {
    const offer = await offerService.createOffer(req.user.id, req.body);
    res.status(201).json({ success: true, data: offer });
  } catch (error) {
    next(error);
  }
}

async function updateOffer(req, res, next) {
  try {
    const offer = await offerService.updateOffer(req.user.id, Number(req.params.id), req.body);
    res.json({ success: true, data: offer });
  } catch (error) {
    next(error);
  }
}

async function deleteOffer(req, res, next) {
  try {
    await offerService.deleteOffer(req.user.id, Number(req.params.id));
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listOffers,
  getOffer,
  createOffer,
  updateOffer,
  deleteOffer,
};


