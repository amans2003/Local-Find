const mongoose = require('mongoose');
const dns = require('dns');
const logger = require('../utils/logger');

const connectDB = async () => {
  try {
    const uriHost = (process.env.MONGODB_URI.match(/@([^/?]+)/) || [])[1];
    if (uriHost) {
      dns.resolveSrv(`_mongodb._tcp.${uriHost}`, (err, addresses) => {
        if (err) logger.error(`DNS SRV lookup failed for ${uriHost}: ${err.code} ${err.message}`);
        else logger.error(`DNS SRV lookup OK for ${uriHost}: ${addresses.length} servers found`);
      });
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      dbName: 'localfind',
    });
    logger.info(`MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    logger.error(`MongoDB connection error: ${err.message}`);
    if (err.reason && err.reason.servers) {
      for (const [addr, desc] of err.reason.servers) {
        logger.error(`MongoDB server ${addr}: ${desc.error ? desc.error.message || desc.error : desc.type}`);
      }
    }
    // Keep server running for diagnostics
  }
};

module.exports = connectDB;
