const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const privateKey = () => (process.env.JWT_PRIVATE_KEY || '').replace(/\\n/g, '\n');
const publicKey = () => (process.env.JWT_PUBLIC_KEY || '').replace(/\\n/g, '\n');

const generateAccessToken = (payload) =>
  jwt.sign(payload, privateKey(), {
    algorithm: 'RS256',
    expiresIn: process.env.JWT_ACCESS_EXPIRE || '15m',
  });

const generateRefreshToken = (payload) =>
  jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d',
  });

const verifyAccessToken = (token) =>
  jwt.verify(token, publicKey(), { algorithms: ['RS256'] });

const verifyRefreshToken = (token) =>
  jwt.verify(token, process.env.JWT_REFRESH_SECRET);

const generateResetToken = () => {
  const token = crypto.randomBytes(32).toString('hex');
  const hashed = crypto.createHash('sha256').update(token).digest('hex');
  const expiry = Date.now() + 60 * 60 * 1000;
  return { token, hashed, expiry };
};

const setRefreshCookie = (res, token) => {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

const clearRefreshCookie = (res) => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
  });
};

const cookieOpts = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'Strict',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const setAdminRefreshCookie = (res, token) =>
  res.cookie('adminRefreshToken', token, cookieOpts);

const clearAdminRefreshCookie = (res) =>
  res.clearCookie('adminRefreshToken', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'Strict' });

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  generateResetToken,
  setRefreshCookie,
  clearRefreshCookie,
  setAdminRefreshCookie,
  clearAdminRefreshCookie,
};
