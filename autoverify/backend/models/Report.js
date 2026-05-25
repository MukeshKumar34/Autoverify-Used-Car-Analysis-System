const mongoose = require('mongoose');

const challanSchema = new mongoose.Schema({
  type:     { type: String },
  location: { type: String },
  date:     { type: Date },
  amount:   { type: Number },
  status:   { type: String, enum: ['paid', 'pending'], default: 'paid' }
}, { _id: false });

const reportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  registrationNumber: {
    type: String,
    required: true,
    uppercase: true,
    trim: true
  },
  askingPrice: { type: Number, default: 0 },

  vehicleDetails: {
    make:         { type: String, default: '' },
    model:        { type: String, default: '' },
    variant:      { type: String, default: '' },
    year:         { type: Number, default: 0 },
    fuelType:     { type: String, default: '' },
    transmission: { type: String, default: '' },
    color:        { type: String, default: '' },
    engineCC:     { type: Number, default: 0 },
    ownerCount:   { type: Number, default: 1 },
    rto:          { type: String, default: '' },
    city:         { type: String, default: '' },
    odometer:     { type: Number, default: 0 }
  },

  engineHealth: {
    engine:       { type: Number, min: 0, max: 100, default: 0 },
    transmission: { type: Number, min: 0, max: 100, default: 0 },
    body:         { type: Number, min: 0, max: 100, default: 0 },
    interior:     { type: Number, min: 0, max: 100, default: 0 }
  },

  mileage: {
    actual:           { type: Number, default: 0 },
    araiRated:        { type: Number, default: 0 },
    annualAvg:        { type: Number, default: 0 },
    serviceOverdueKm: { type: Number, default: 0 }
  },

  challans: [challanSchema],

  pricing: {
    askingPrice:  { type: Number, default: 0 },
    marketMin:    { type: Number, default: 0 },
    marketMax:    { type: Number, default: 0 },
    suggestedMin: { type: Number, default: 0 },
    suggestedMax: { type: Number, default: 0 },
    overvaluedBy: { type: Number, default: 0 }
  },

  safety: {
    accidents:       { type: Number, default: 0 },
    blacklisted:     { type: Boolean, default: false },
    stolen:          { type: Boolean, default: false },
    insuranceExpiry: { type: Date, default: null },
    pucExpiry:       { type: Date, default: null },
    loanClear:       { type: Boolean, default: true }
  },

  trustScore: { type: Number, min: 0, max: 100, default: 0 },
  riskLevel:  { type: String, enum: ['low', 'moderate', 'high'], default: 'moderate' },
  aiVerdict:  { type: String, default: '' },
  status:     { type: String, enum: ['processing', 'completed', 'failed'], default: 'completed' }

}, { timestamps: true });

// Index for fast user queries
reportSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Report', reportSchema);
