const leadCalculationService = require('../services/leadCalculation.service');

async function createLeadCalculation(req, res) {
  const result = await leadCalculationService.createLeadCalculation(req.body || {});
  res.status(201).json(result);
}

module.exports = {
  createLeadCalculation
};
