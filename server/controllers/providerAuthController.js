const crypto = require('crypto');
const Provider = require('../models/Provider');
const { success, error } = require('../utils/apiResponse');
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  generateResetToken,
  setRefreshCookie,
  clearRefreshCookie,
} = require('../utils/generateToken');

exports.register = async (req, res) => {
  const { businessName, ownerName, email, phone, password, category } = req.body;
  if (!businessName || !ownerName || !email || !phone || !password || !category)
    return error(res, 'All fields are required', 400);

  const exists = await Provider.findOne({ $or: [{ email }, { phone }] });
  if (exists) return error(res, 'Email or phone already registered', 409);

  const provider = await Provider.create({
    businessName, ownerName, email, phone, password, category,
    isPhoneVerified: true,
    status: 'active',
  });

  const refreshToken = generateRefreshToken({ id: provider._id, role: 'provider' });
  provider.refreshToken = refreshToken;
  await provider.save({ validateBeforeSave: false });

  const accessToken = generateAccessToken({ id: provider._id, role: 'provider' });
  setRefreshCookie(res, refreshToken);
  success(res, {
    accessToken,
    provider: {
      id: provider._id,
      businessName: provider.businessName,
      ownerName: provider.ownerName,
      email: provider.email,
      status: provider.status,
    },
  }, 'Business registered successfully', 201);
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const provider = await Provider.findOne({ email }).select('+password +refreshToken');
  if (!provider) return error(res, 'Invalid credentials', 401);
  if (provider.status === 'suspended') return error(res, 'Account suspended. Contact support.', 403);

  const match = await provider.matchPassword(password);
  if (!match) return error(res, 'Invalid credentials', 401);

  const refreshToken = generateRefreshToken({ id: provider._id, role: 'provider' });
  provider.refreshToken = refreshToken;
  await provider.save({ validateBeforeSave: false });

  const accessToken = generateAccessToken({ id: provider._id, role: 'provider' });
  setRefreshCookie(res, refreshToken);
  success(res, {
    accessToken,
    provider: {
      id: provider._id,
      businessName: provider.businessName,
      ownerName: provider.ownerName,
      email: provider.email,
      status: provider.status,
    },
  });
};

exports.refresh = async (req, res) => {
  const token = req.cookies?.refreshToken;
  if (!token) return error(res, 'No refresh token', 401);
  try {
    const decoded = verifyRefreshToken(token);
    if (decoded.role !== 'provider') return error(res, 'Invalid token type', 401);
    const provider = await Provider.findById(decoded.id).select('+refreshToken');
    if (!provider || provider.refreshToken !== token) return error(res, 'Invalid refresh token', 401);
    const accessToken = generateAccessToken({ id: provider._id, role: 'provider' });
    const newRefresh = generateRefreshToken({ id: provider._id, role: 'provider' });
    provider.refreshToken = newRefresh;
    await provider.save({ validateBeforeSave: false });
    setRefreshCookie(res, newRefresh);
    success(res, { accessToken });
  } catch {
    return error(res, 'Invalid or expired refresh token', 401);
  }
};

exports.logout = async (req, res) => {
  const token = req.cookies?.refreshToken;
  if (token) await Provider.findOneAndUpdate({ refreshToken: token }, { refreshToken: null });
  clearRefreshCookie(res);
  success(res, {}, 'Logged out');
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  const provider = await Provider.findOne({ email });
  if (!provider) return success(res, {}, 'If that email exists, a reset link was sent');

  const { token, hashed, expiry } = generateResetToken();
  provider.resetPasswordToken = hashed;
  provider.resetPasswordExpiry = expiry;
  await provider.save({ validateBeforeSave: false });

  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${token}&email=${encodeURIComponent(email)}&t=provider`;
  const { sendPasswordResetEmail } = require('../services/emailService');
  await sendPasswordResetEmail(email, resetUrl);
  success(res, {}, 'Password reset email sent');
};

exports.resetPassword = async (req, res) => {
  const { email, token, password } = req.body;
  const hashed = crypto.createHash('sha256').update(token).digest('hex');
  const provider = await Provider.findOne({
    email,
    resetPasswordToken: hashed,
    resetPasswordExpiry: { $gt: Date.now() },
  }).select('+resetPasswordToken +resetPasswordExpiry');
  if (!provider) return error(res, 'Invalid or expired reset link', 400);

  provider.password = password;
  provider.resetPasswordToken = undefined;
  provider.resetPasswordExpiry = undefined;
  await provider.save();
  success(res, {}, 'Password reset successfully');
};
