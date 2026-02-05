const { Types } = require('mongoose');
const Lead = require('../models/lead.model');
const HttpError = require('../utils/httpError');

const requiredFields = ['fullName', 'email'];

function validateLeadPayload(payload = {}) {
  const errors = [];
  for (const field of requiredFields) {
    if (!payload[field] || typeof payload[field] !== 'string' || payload[field].trim().length === 0) {
      errors.push(`${field} is required.`);
    }
  }

  if (payload.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
    errors.push('email must be a valid address.');
  }

  if (errors.length) {
    throw new HttpError(422, errors.join(' '));
  }

  const sanitized = {
    fullName: payload.fullName.trim(),
    email: payload.email.trim().toLowerCase(),
    phoneNumber: payload.phoneNumber ? String(payload.phoneNumber).trim() : undefined,
    companyName: payload.companyName ? payload.companyName.trim() : undefined
  };

  return sanitized;
}

async function createLead(payload, additionalFields = {}) {
  const data = {
    ...validateLeadPayload(payload),
    ...additionalFields
  };
  const doc = await Lead.create(data);
  return doc.toObject({ versionKey: false });
}

function ensureObjectId(id, fieldName = 'id') {
  if (!id) {
    throw new HttpError(400, `${fieldName} is required.`);
  }
  if (!Types.ObjectId.isValid(id)) {
    throw new HttpError(400, `Invalid ${fieldName}.`);
  }
  return new Types.ObjectId(id);
}

async function listLeads({ limit = 25, cursor }) {
  const safeLimit = Math.min(Math.max(Number(limit) || 25, 1), 100);
  const query = {};
  if (cursor) {
    query._id = { $lt: ensureObjectId(cursor, 'cursor') };
  }

  const docs = await Lead.find(query)
    .sort({ _id: -1 })
    .limit(safeLimit + 1)
    .lean({ versionKey: false });

  const hasMore = docs.length > safeLimit;
  const items = hasMore ? docs.slice(0, safeLimit) : docs;
  const nextCursor = hasMore ? items[items.length - 1]._id.toString() : null;

  return { items, nextCursor };
}

async function getLeadById(id) {
  const doc = await Lead.findById(ensureObjectId(id)).lean({ versionKey: false });
  return doc;
}

module.exports = {
  createLead,
  listLeads,
  getLeadById
};
