const { Types } = require('mongoose');
const Calculation = require('../models/calculation.model');
const {
  CALC_VERSION,
  HOURLY_COST,
  SHOWINGS_PER_VACANCY,
  VACANCY_REDUCTION,
  TIME_REDUCTION,
  CURRENCY
} = require('../config/constants');
const { normalizeSelection } = require('../utils/formOptions');

function roundCurrency(value) {
  return Math.round(value * 100) / 100;
}

function deriveMetrics(inputs) {
  const { vacancies, daysVacant, monthlyRent, showTimeHours } = inputs;

  const dailyRent = monthlyRent / 30;
  const vacancyLossPerProperty = dailyRent * daysVacant;
  const totalVacancyLoss = vacancies * vacancyLossPerProperty;
  const timeCost =
    vacancies * showTimeHours * SHOWINGS_PER_VACANCY * HOURLY_COST;
  const vacancySavings = totalVacancyLoss * VACANCY_REDUCTION;
  const timeSavings = timeCost * TIME_REDUCTION;
  const totalSavings = vacancySavings + timeSavings;
  const annualImpact = totalSavings * 12;

  return {
    dailyRent: roundCurrency(dailyRent),
    vacancyLossPerProperty: roundCurrency(vacancyLossPerProperty),
    totalVacancyLoss: roundCurrency(totalVacancyLoss),
    timeCost: roundCurrency(timeCost),
    vacancySavings: roundCurrency(vacancySavings),
    timeSavings: roundCurrency(timeSavings),
    totalSavings: roundCurrency(totalSavings),
    annualImpact: roundCurrency(annualImpact)
  };
}

async function createCalculation(payload = {}) {
  const vacancies = normalizeSelection('vacancies', payload.vacancies);
  const daysVacant = normalizeSelection('daysVacant', payload.daysVacant);
  const rentSelection = payload.monthlyRent || payload.averageRent;
  const monthlyRent = normalizeSelection('monthlyRent', rentSelection);
  const showTimeHours = normalizeSelection('showTimeHours', payload.showTimeHours);

  const baseInputs = {
    vacancies: vacancies.value,
    daysVacant: daysVacant.value,
    monthlyRent: monthlyRent.value,
    showTimeHours: showTimeHours.value
  };

  const metrics = deriveMetrics(baseInputs);

  const note =
    typeof payload.notes === 'string' && payload.notes.trim().length > 0
      ? payload.notes.trim()
      : undefined;

  const doc = await Calculation.create({
    ...baseInputs,
    vacancyLabel: vacancies.label,
    daysVacantLabel: daysVacant.label,
    monthlyRentLabel: monthlyRent.label,
    showTimeLabel: showTimeHours.label,
    ...metrics,
    currency: CURRENCY,
    calcVersion: CALC_VERSION,
    notes: note ? note.slice(0, 2000) : undefined
  });

  return doc.toObject({ versionKey: false });
}

function ensureObjectId(id, fieldName = 'id') {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error(`Invalid ${fieldName}.`);
  }
  return new Types.ObjectId(id);
}

async function listCalculations({ limit = 20, cursor }) {
  const safeLimit = Math.min(Math.max(Number(limit) || 20, 1), 100);
  const query = {};
  if (cursor) {
    query._id = { $lt: ensureObjectId(cursor, 'cursor') };
  }

  const docs = await Calculation.find(query)
    .sort({ _id: -1 })
    .limit(safeLimit + 1)
    .lean({ versionKey: false });

  const hasMore = docs.length > safeLimit;
  const items = hasMore ? docs.slice(0, safeLimit) : docs;
  const nextCursor = hasMore ? items[items.length - 1]._id.toString() : null;

  return { items, nextCursor };
}

async function getCalculationById(id) {
  const doc = await Calculation.findById(ensureObjectId(id)).lean({ versionKey: false });
  return doc;
}

module.exports = {
  createCalculation,
  listCalculations,
  getCalculationById,
  deriveMetrics
};
