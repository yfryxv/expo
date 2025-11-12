const applicationService = require('../services/applicationService');

async function createApplication(req, res, next) {
  try {
    const application = await applicationService.createApplication(req.user.id, req.body);
    res.status(201).json({ success: true, data: application });
  } catch (error) {
    next(error);
  }
}

async function listMyApplications(req, res, next) {
  try {
    const applications = await applicationService.listApplicationsForCandidate(req.user.id);
    res.json({ success: true, data: applications });
  } catch (error) {
    next(error);
  }
}

async function listApplicants(req, res, next) {
  try {
    const applicants = await applicationService.listApplicantsForOffer(
      req.user.id,
      Number(req.params.offerId)
    );
    res.json({ success: true, data: applicants });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createApplication,
  listMyApplications,
  listApplicants,
};


