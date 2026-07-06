const Redis = require('ioredis');
const logger = require('../utils/logger');

let redis;

const getRedis = () => {
  if (!redis) {
    redis = new Redis(process.env.REDIS_URL, {
      lazyConnect: true,
      maxRetriesPerRequest: 3,
      retryStrategy: (times) => Math.min(times * 50, 2000),
    });
    redis.on('connect', () => logger.info('Redis connected'));
    redis.on('error', (err) => logger.warn(`Redis error: ${err.message}`));
  }
  return redis;
};

module.exports = getRedis;
