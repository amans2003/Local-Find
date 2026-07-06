const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 60 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, select: false, minlength: 8 },
    avatar: { type: String, default: '' },
    phone: { type: String, default: '' },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    provider: { type: String, enum: ['local', 'google'], default: 'local' },
    googleId: { type: String, select: false },
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    emailOtp: { type: String, select: false },
    emailOtpExpiry: { type: Date, select: false },
    resetPasswordToken: { type: String, select: false },
    resetPasswordExpiry: { type: Date, select: false },
    refreshToken: { type: String, select: false },
    bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Listing' }],
    lastLogin: { type: Date },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.matchPassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.toPublicJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.googleId;
  delete obj.refreshToken;
  delete obj.emailOtp;
  delete obj.emailOtpExpiry;
  delete obj.resetPasswordToken;
  delete obj.resetPasswordExpiry;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
