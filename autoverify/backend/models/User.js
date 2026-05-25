const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstName:  { type: String, required: true, trim: true },
  lastName:   { type: String, required: true, trim: true },
  email:      { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone:      { type: String, trim: true, default: '' },
  password:   { type: String, required: true, minlength: 6 },
  city:       { type: String, default: '' },
  plan:       { type: String, enum: ['free', 'pro', 'enterprise'], default: 'free' },
  checksRemaining: { type: Number, default: 3 },
  totalChecks:     { type: Number, default: 0 },
  fraudCaught:     { type: Number, default: 0 },
  notifications: {
    email:   { type: Boolean, default: true },
    challan: { type: Boolean, default: true },
    price:   { type: Boolean, default: false },
    sms:     { type: Boolean, default: false }
  },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password
userSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

// Remove password from JSON output
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
