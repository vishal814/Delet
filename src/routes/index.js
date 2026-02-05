const express = require('express');
const metadataController = require('../controllers/metadata.controller');
const calculationController = require('../controllers/calculation.controller');
const asyncHandler = require('../utils/asyncHandler');
const leadController = require('../controllers/lead.controller');
const leadCalculationController = require('../controllers/leadCalculation.controller');

const router = express.Router();

router.get('/metadata/form', metadataController.getFormMetadata);

router.post(
  '/calculations',
  asyncHandler(calculationController.createCalculation)
);

router.get(
  '/calculations',
  asyncHandler(calculationController.listCalculations)
);

router.get(
  '/calculations/:id',
  asyncHandler(calculationController.getCalculation)
);

router.post('/leads', asyncHandler(leadController.createLead));

router.get('/leads', asyncHandler(leadController.listLeads));

router.get('/leads/:id', asyncHandler(leadController.getLead));

router.post(
  '/lead-calculations',
  asyncHandler(leadCalculationController.createLeadCalculation)
);

module.exports = router;
