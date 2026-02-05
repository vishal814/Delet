const mongoose = require('mongoose');
const { Schema } = mongoose;

const calculationSchema = new Schema(
  {
    vacancies: { type: Number, required: true },
    vacancyLabel: { type: String },
    daysVacant: { type: Number, required: true },
    daysVacantLabel: { type: String },
    monthlyRent: { type: Number, required: true },
    monthlyRentLabel: { type: String },
    showTimeHours: { type: Number, required: true },
    showTimeLabel: { type: String },
    dailyRent: Number,
    vacancyLossPerProperty: Number,
    totalVacancyLoss: Number,
    beforeCost: Number,
    afterCost: Number,
    timeCost: Number,
    vacancySavings: Number,
    timeSavings: Number,
    totalSavings: Number,
    annualImpact: Number,
    currency: { type: String, default: 'USD' },
    calcVersion: { type: String },
    notes: { type: String, maxlength: 2000 }
  },
  {
    timestamps: { createdAt: true, updatedAt: false }
  }
);

calculationSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Calculation', calculationSchema);
