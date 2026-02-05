const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true, maxlength: 200 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 320 },
    phoneNumber: { type: String, trim: true, maxlength: 50 },
    companyName: { type: String, trim: true, maxlength: 200 },
    calculationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Calculation' }
  },
  {
    timestamps: { createdAt: true, updatedAt: false }
  }
);

leadSchema.index({ createdAt: -1 });
leadSchema.index({ email: 1 });

module.exports = mongoose.model('Lead', leadSchema);
