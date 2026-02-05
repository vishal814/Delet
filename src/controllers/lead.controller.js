const leadService = require('../services/lead.service');
const HttpError = require('../utils/httpError');

async function createLead(req, res) {
  const lead = await leadService.createLead(req.body || {});
  res.status(201).json(lead);
}

async function listLeads(req, res) {
  const result = await leadService.listLeads({
    limit: req.query.limit,
    cursor: req.query.cursor
  });
  res.json(result);
}

async function getLead(req, res) {
  const lead = await leadService.getLeadById(req.params.id);
  if (!lead) {
    throw new HttpError(404, 'Lead not found.');
  }
  res.json(lead);
}

module.exports = {
  createLead,
  listLeads,
  getLead
};
