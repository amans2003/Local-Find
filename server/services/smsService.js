const axios = require('axios');
const logger = require('../utils/logger');

const sendSms = async (phone, message) => {
  if (!process.env.MSG91_API_KEY) {
    logger.warn(`SMS skipped (no key) to ${phone}: ${message}`);
    return;
  }
  try {
    await axios.post('https://api.msg91.com/api/v5/flow/', {
      template_id: process.env.MSG91_TEMPLATE_ID,
      short_url: '0',
      recipients: [{ mobiles: `91${phone}`, var: message }],
    }, {
      headers: { authkey: process.env.MSG91_API_KEY, 'Content-Type': 'application/json' },
    });
    logger.info(`SMS sent to ${phone}`);
  } catch (err) {
    logger.error(`SMS send failed: ${err.message}`);
  }
};

const sendOtpSms = (phone, otp) =>
  sendSms(phone, `Your LocalFind OTP is ${otp}. Valid for 10 minutes. Do not share.`);

module.exports = { sendSms, sendOtpSms };
