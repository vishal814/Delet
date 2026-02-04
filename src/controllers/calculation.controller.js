const HttpError = require('../utils/httpError');
const calculationService = require('../services/calculation.service');

async function createCalculation(req, res) {
  const record = await calculationService.createCalculation(req.body || {});
  res.status(201).json(record);
}

async function listCalculations(req, res) {
  const result = await calculationService.listCalculations({
    limit: req.query.limit,
    cursor: req.query.cursor
  });
  res.json(result);
}

async function getCalculation(req, res) {
  const doc = await calculationService.getCalculationById(req.params.id);
  if (!doc) {
    throw new HttpError(404, 'Calculation not found.');
  }
  res.json(doc);
}

module.exports = {
  createCalculation,
  listCalculations,
  getCalculation
};
