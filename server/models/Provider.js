const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const providerSchema = new mongoose.Schema(
  {
    businessName: { type: String, required: true, trim: true, maxlength: 100 },
    ownerName: { type: String, required: true, trim: true, maxlength: 60 },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String, required: true },
    password: { type: String, required: true, select: false, minlength: 8 },
    category: { type: String, required: true },
    logo: { type: String, default: '' },
    status: {
      type: String,
      enum: ['pending', 'active', 'suspended'],
      default: 'pending',
    },
    isPhoneVerified: { type: Boolean, default: false },
    phoneOtp: { type: String, select: false },
    phoneOtpExpiry: { type: Date, select: false },
    resetPasswordToken: { type: String, select: false },
    resetPasswordExpiry: { type: Date, select: false },
    refreshToken: { type: String, select: false },
    subscription: {
      plan: { type: String, enum: ['free', 'basic', 'pro'], default: 'free' },
      expiresAt: { type: Date },
      maxListings: { type: Number, default: 1 },
    },
    listings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Listing' }],
  },
  { timestamps: true }
);

providerSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

providerSchema.methods.matchPassword = function (entered) {
  return bcrypt.compare(entered, this.password);
};

module.exports = mongoose.model('Provider', providerSchema);
