const crypto = require('crypto');
const User = require('../models/User');
const { success, error } = require('../utils/apiResponse');
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  generateResetToken,
  setRefreshCookie,
  clearRefreshCookie,
  setAdminRefreshCookie,
  clearAdminRefreshCookie,
} = require('../utils/generateToken');

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return error(res, 'Email already registered', 409);

  const user = await User.create({ name, email, password, isVerified: false });

  const refreshToken = generateRefreshToken({ id: user._id, role: user.role });
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  const accessToken = generateAccessToken({ id: user._id, role: user.role });
  setRefreshCookie(res, refreshToken);
  success(res, { accessToken, user: user.toPublicJSON() }, 'Account created successfully', 201);
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');
  if (!user || !user.password) return error(res, 'Invalid credentials', 401);

  const match = await user.matchPassword(password);
  if (!match) return error(res, 'Invalid credentials', 401);

  if (!user.isActive) return error(res, 'Account is inactive', 403);

  user.lastLogin = new Date();
  const refreshToken = generateRefreshToken({ id: user._id, role: user.role });
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  const accessToken = generateAccessToken({ id: user._id, role: user.role });
  if (user.role === 'admin') {
    setAdminRefreshCookie(res, refreshToken);
  } else {
    setRefreshCookie(res, refreshToken);
  }
  success(res, { accessToken, user: user.toPublicJSON() }, 'Login successful');
};

exports.refresh = async (req, res) => {
  const token = req.cookies?.refreshToken;
  if (!token) return error(res, 'No refresh token', 401);

  try {
    const decoded = verifyRefreshToken(token);
    const user = await User.findById(decoded.id).select('+refreshToken');
    if (!user || user.refreshToken !== token) return error(res, 'Invalid refresh token', 401);

    const accessToken = generateAccessToken({ id: user._id, role: user.role });
    const newRefresh = generateRefreshToken({ id: user._id, role: user.role });
    user.refreshToken = newRefresh;
    await user.save({ validateBeforeSave: false });
    setRefreshCookie(res, newRefresh);
    success(res, { accessToken });
  } catch {
    return error(res, 'Invalid or expired refresh token', 401);
  }
};

exports.adminRefresh = async (req, res) => {
  const token = req.cookies?.adminRefreshToken;
  if (!token) return error(res, 'No admin refresh token', 401);

  try {
    const decoded = verifyRefreshToken(token);
    const user = await User.findById(decoded.id).select('+refreshToken');
    if (!user || user.role !== 'admin' || user.refreshToken !== token)
      return error(res, 'Invalid admin refresh token', 401);

    const accessToken = generateAccessToken({ id: user._id, role: user.role });
    const newRefresh = generateRefreshToken({ id: user._id, role: user.role });
    user.refreshToken = newRefresh;
    await user.save({ validateBeforeSave: false });
    setAdminRefreshCookie(res, newRefresh);
    success(res, { accessToken });
  } catch {
    return error(res, 'Invalid or expired admin refresh token', 401);
  }
};

exports.adminLogout = async (req, res) => {
  const token = req.cookies?.adminRefreshToken;
  if (token) {
    await User.findOneAndUpdate({ refreshToken: token }, { refreshToken: null });
  }
  clearAdminRefreshCookie(res);
  success(res, {}, 'Logged out');
};

exports.logout = async (req, res) => {
  const token = req.cookies?.refreshToken;
  if (token) {
    await User.findOneAndUpdate({ refreshToken: token }, { refreshToken: null });
  }
  clearRefreshCookie(res);
  success(res, {}, 'Logged out');
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return success(res, {}, 'If that email exists, a reset link was sent');

  const { token, hashed, expiry } = generateResetToken();
  user.resetPasswordToken = hashed;
  user.resetPasswordExpiry = expiry;
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${token}&email=${email}`;
  const { sendPasswordResetEmail } = require('../services/emailService');
  await sendPasswordResetEmail(email, resetUrl);
  success(res, {}, 'Password reset email sent');
};

exports.resetPassword = async (req, res) => {
  const { email, token, password } = req.body;
  const hashed = crypto.createHash('sha256').update(token).digest('hex');
  const user = await User.findOne({
    email,
    resetPasswordToken: hashed,
    resetPasswordExpiry: { $gt: Date.now() },
  });
  if (!user) return error(res, 'Invalid or expired reset token', 400);

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpiry = undefined;
  await user.save();
  success(res, {}, 'Password reset successfully');
};
