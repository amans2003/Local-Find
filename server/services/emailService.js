const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

let _etherealTransport = null;

const createTransport = async () => {
  if (process.env.SENDGRID_API_KEY) {
    return nodemailer.createTransport({
      host: 'smtp.sendgrid.net',
      port: 587,
      auth: { user: 'apikey', pass: process.env.SENDGRID_API_KEY },
    });
  }

  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
  }

  // Dev fallback: auto-create a free Ethereal test account
  if (!_etherealTransport) {
    const testAccount = await nodemailer.createTestAccount();
    _etherealTransport = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: { user: testAccount.user, pass: testAccount.pass },
    });
    console.log('\n📧 No SMTP configured — using Ethereal preview email');
    console.log(`   User: ${testAccount.user}`);
    console.log(`   Pass: ${testAccount.pass}`);
    console.log('   Preview links will be printed below each send.\n');
  }
  return _etherealTransport;
};

const sendEmail = async ({ to, subject, html }) => {
  try {
    const transporter = await createTransport();
    const info = await transporter.sendMail({
      from: `${process.env.SMTP_FROM_NAME || 'Digital Patna'} <${process.env.SMTP_FROM_EMAIL || 'noreply@digitalpatna.in'}>`,
      to,
      subject,
      html,
    });
    logger.info(`Email sent to ${to}: ${subject}`);

    // Print preview URL when using Ethereal
    const preview = nodemailer.getTestMessageUrl(info);
    if (preview) {
      console.log(`\n📨 Email preview (click to view): ${preview}\n`);
    }
  } catch (err) {
    logger.error(`Email send failed: ${err.message}`);
    console.error('Email error:', err.message);
  }
};

const sendOtpEmail = (to, otp) =>
  sendEmail({
    to,
    subject: 'Your Digital Patna verification code',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;background:#f8f9fa;border-radius:16px;">
        <div style="text-align:center;margin-bottom:28px;">
          <h1 style="color:#1B3A6B;font-size:24px;margin:0;">Digital Patna</h1>
          <p style="color:#6b7280;font-size:14px;margin:6px 0 0;">Local Business Directory</p>
        </div>
        <div style="background:#fff;border-radius:12px;padding:28px;border:1px solid #e5e7eb;">
          <h2 style="color:#111827;font-size:18px;margin:0 0 8px;">Verify your email address</h2>
          <p style="color:#6b7280;font-size:14px;margin:0 0 24px;">Enter the code below to activate your Digital Patna account.</p>
          <div style="background:#f0f4ff;border-radius:12px;padding:20px;text-align:center;margin-bottom:24px;">
            <span style="font-size:40px;font-weight:800;letter-spacing:12px;color:#1B3A6B;">${otp}</span>
          </div>
          <p style="color:#6b7280;font-size:13px;margin:0;">This code expires in <strong>10 minutes</strong>. If you didn't create an account, you can safely ignore this email.</p>
        </div>
        <p style="text-align:center;color:#9ca3af;font-size:12px;margin-top:20px;">© 2025 Digital Patna. All rights reserved.</p>
      </div>
    `,
  });

const sendPasswordResetEmail = (to, resetUrl) =>
  sendEmail({
    to,
    subject: 'Reset your Digital Patna password',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;background:#f8f9fa;border-radius:16px;">
        <div style="text-align:center;margin-bottom:28px;">
          <h1 style="color:#1B3A6B;font-size:24px;margin:0;">Digital Patna</h1>
          <p style="color:#6b7280;font-size:14px;margin:6px 0 0;">Local Business Directory</p>
        </div>
        <div style="background:#fff;border-radius:12px;padding:28px;border:1px solid #e5e7eb;">
          <h2 style="color:#111827;font-size:18px;margin:0 0 8px;">Reset your password</h2>
          <p style="color:#6b7280;font-size:14px;margin:0 0 24px;">
            We received a request to reset your password. Click the button below to choose a new one.
          </p>
          <div style="text-align:center;margin:24px 0;">
            <a href="${resetUrl}" style="background:#1B3A6B;color:#fff;text-decoration:none;padding:14px 32px;border-radius:10px;font-size:15px;font-weight:600;display:inline-block;">
              Reset Password
            </a>
          </div>
          <p style="color:#6b7280;font-size:13px;margin:0;">
            This link expires in <strong>1 hour</strong>. If you didn't request a password reset, you can safely ignore this email.
          </p>
          <p style="color:#9ca3af;font-size:12px;margin:16px 0 0;word-break:break-all;">
            Or copy this link: ${resetUrl}
          </p>
        </div>
        <p style="text-align:center;color:#9ca3af;font-size:12px;margin-top:20px;">© 2025 Digital Patna. All rights reserved.</p>
      </div>
    `,
  });

const sendListingStatusEmail = (to, listingName, status, reason = '') =>
  sendEmail({
    to,
    subject: `Listing ${status}: ${listingName}`,
    html: `<p>Your listing <strong>${listingName}</strong> has been <strong>${status}</strong>. ${reason ? `<br/>Reason: ${reason}` : ''}</p>`,
  });

module.exports = { sendEmail, sendOtpEmail, sendPasswordResetEmail, sendListingStatusEmail };
