const { Types } = require('mongoose');
const HttpError = require('../utils/httpError');
const Lead = require('../models/lead.model');
const leadService = require('./lead.service');
const calculationService = require('./calculation.service');

async function createLeadCalculation(payload = {}) {
  const { leadId, lead, calculation } = payload;
  if (!calculation) {
    throw new HttpError(400, 'calculation payload is required.');
  }

  let leadDoc;

  if (leadId) {
    if (!Types.ObjectId.isValid(leadId)) {
      throw new HttpError(400, 'leadId must be a valid identifier.');
    }

    leadDoc = await Lead.findById(leadId);
    if (!leadDoc) {
      throw new HttpError(404, 'Lead not found.');
    }
  } else if (lead) {
    const createdLead = await leadService.createLead(lead);
    leadDoc = await Lead.findById(createdLead._id);
  } else {
    throw new HttpError(400, 'Provide either leadId or lead information.');
  }

  const calculationRecord = await calculationService.createCalculation(calculation);

  leadDoc.calculationId = calculationRecord._id;
  await leadDoc.save();
  const leadRecord = leadDoc.toObject({ versionKey: false });

  return {
    lead: leadRecord,
    calculation: calculationRecord
  };
}

module.exports = {
  createLeadCalculation
};
