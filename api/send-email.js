import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  // CORS configuration
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    const { to, subject, html, leaderName, teamName, teamId } = req.body || {};

    if (!to) {
      return res.status(400).json({ error: 'Recipient email address (to) is required.' });
    }

    const hostEmail = process.env.HOST_EMAIL || process.env.VITE_HOST_EMAIL || 'haxlr8ecemitm@gmail.com';
    const hostPassword = process.env.HOST_EMAIL_PASSWORD || process.env.GMAIL_APP_PASSWORD || 'fbrnlnfiilorsdzk';

    // Configure Nodemailer for Gmail SMTP
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: hostEmail,
        pass: hostPassword.replace(/\s+/g, '') // strip any accidental whitespace
      }
    });

    const mailOptions = {
      from: `"HAXLR8 3.0 Space Command" <${hostEmail}>`,
      to,
      subject: subject || `🚀 Welcome to HAXLR8 3.0! Confirmation for ${teamName || 'Your Squad'}`,
      html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[HAXLR8 Email Success] Dispatched to ${to}. Message ID: ${info.messageId}`);

    return res.status(200).json({
      success: true,
      messageId: info.messageId,
      message: `Automated email successfully sent from ${hostEmail} to ${to}`
    });
  } catch (error) {
    console.error('[HAXLR8 Email Error]:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Error dispatching automated email'
    });
  }
}
