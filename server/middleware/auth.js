const { verifyAccessToken } = require('../utils/generateToken');
const User = require('../models/User');
const Provider = require('../models/Provider');
const { error } = require('../utils/apiResponse');

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return error(res, 'Not authenticated', 401);
  }
  try {
    const token = authHeader.split(' ')[1];
    const decoded = verifyAccessToken(token);
    if (decoded.role === 'provider') {
      req.provider = await Provider.findById(decoded.id);
      if (!req.provider || req.provider.status === 'suspended') {
        return error(res, 'Account suspended or not found', 401);
      }
    } else {
      req.user = await User.findById(decoded.id);
      if (!req.user || !req.user.isActive) {
        return error(res, 'User not found or inactive', 401);
      }
    }
    req.decoded = decoded;
    next();
  } catch {
    return error(res, 'Invalid or expired token', 401);
  }
};

const requireUser = (req, res, next) => {
  if (!req.user) return error(res, 'User access required', 403);
  next();
};

const requireProvider = (req, res, next) => {
  if (!req.provider) return error(res, 'Provider access required', 403);
  next();
};

const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') return error(res, 'Admin access required', 403);
  next();
};

const optionalAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return next();
  try {
    const token = authHeader.split(' ')[1];
    const decoded = verifyAccessToken(token);
    req.user = await User.findById(decoded.id);
  } catch {}
  next();
};

module.exports = { protect, requireUser, requireProvider, requireAdmin, optionalAuth };
