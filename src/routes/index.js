const express = require('express');
const metadataController = require('../controllers/metadata.controller');
const calculationController = require('../controllers/calculation.controller');
const asyncHandler = require('../utils/asyncHandler');

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

module.exports = router;
