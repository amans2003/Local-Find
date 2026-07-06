const getRedis = require('../config/redis');
const logger = require('../utils/logger');

const SEARCH_TTL = 300;
const LISTING_TTL = 900;
const CATEGORY_TTL = 3600;

const get = async (key) => {
  try {
    const redis = getRedis();
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  } catch (err) {
    logger.warn(`Cache GET error: ${err.message}`);
    return null;
  }
};

const set = async (key, value, ttl = SEARCH_TTL) => {
  try {
    const redis = getRedis();
    await redis.set(key, JSON.stringify(value), 'EX', ttl);
  } catch (err) {
    logger.warn(`Cache SET error: ${err.message}`);
  }
};

const del = async (key) => {
  try {
    const redis = getRedis();
    await redis.del(key);
  } catch (err) {
    logger.warn(`Cache DEL error: ${err.message}`);
  }
};

const delPattern = async (pattern) => {
  try {
    const redis = getRedis();
    const keys = await redis.keys(pattern);
    if (keys.length) await redis.del(...keys);
  } catch (err) {
    logger.warn(`Cache DEL pattern error: ${err.message}`);
  }
};

const setOtp = async (key, otp, ttl = 600) => {
  try {
    const redis = getRedis();
    await redis.set(`otp:${key}`, otp, 'EX', ttl);
  } catch (err) {
    logger.warn(`OTP set error: ${err.message}`);
  }
};

const getOtp = async (key) => {
  try {
    const redis = getRedis();
    return await redis.get(`otp:${key}`);
  } catch (err) {
    logger.warn(`OTP get error: ${err.message}`);
    return null;
  }
};

const delOtp = async (key) => {
  try {
    const redis = getRedis();
    await redis.del(`otp:${key}`);
  } catch {}
};

module.exports = {
  get, set, del, delPattern,
  setOtp, getOtp, delOtp,
  SEARCH_TTL, LISTING_TTL, CATEGORY_TTL,
};
