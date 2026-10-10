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
    const { 
      to, 
      recipientEmail, 
      subject, 
      html, 
      text,
      replyTo,
      leaderName, 
      teamName, 
      teamId,
      isContactMessage,
      senderName,
      senderEmail,
      senderPhone,
      senderMessage,
    } = req.body || {};

    const hostEmail = process.env.HOST_EMAIL || process.env.VITE_HOST_EMAIL || 'haxlr8ecemitm@gmail.com';
    const hostPassword = process.env.HOST_EMAIL_PASSWORD || process.env.GMAIL_APP_PASSWORD || 'fbrnlnfiilorsdzk';

    const targetTo = to || recipientEmail || (isContactMessage ? hostEmail : null);

    if (!targetTo) {
      return res.status(400).json({ error: 'Recipient email address (to) is required.' });
    }

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
      to: targetTo,
      replyTo: replyTo || (isContactMessage && senderEmail ? senderEmail : undefined),
      subject: subject || (isContactMessage ? `🚨 New Contact Inquiry: ${senderName || 'Participant'} (${senderPhone || 'No Phone'})` : `🚀 Welcome to HAXLR8 3.0! Confirmation for ${teamName || 'Your Squad'}`),
      html: html || (text ? `<p>${text}</p>` : undefined),
      text: text || undefined
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[HAXLR8 Email Success] Dispatched to ${targetTo}. Message ID: ${info.messageId}`);

    // If it's a contact message, ALSO send an automatic confirmation email to the participant
    if (isContactMessage && senderEmail && senderEmail !== hostEmail) {
      try {
        const participantMailOptions = {
          from: `"HAXLR8 3.0 Flight Command" <${hostEmail}>`,
          to: senderEmail,
          subject: `🚀 Transmission Received: We got your message, ${senderName || 'Innovator'}!`,
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; color: #0f172a;">
              <div style="background: #0f172a; padding: 24px; text-align: center; border-bottom: 3px solid #ff3b69;">
                <h2 style="color: #ffffff; margin: 0; font-size: 20px;">HAXLR8 3.0 Space Flight Command</h2>
                <p style="color: #fda4af; margin: 4px 0 0; font-size: 12px; font-weight: 700; text-transform: uppercase;">Maharaja Institute of Technology Mysore</p>
              </div>
              <div style="padding: 30px 24px;">
                <h3 style="color: #0f172a; margin: 0 0 12px;">Transmission Successfully Received! 🛰️</h3>
                <p style="color: #475569; font-size: 14px; line-height: 1.6;">
                  Hi <strong>${senderName || 'there'}</strong>, your inquiry has been beamed directly to our Student Coordinators and Faculty Lead team at <strong>${hostEmail}</strong>.
                </p>
                <div style="background: #f8fafc; border-left: 4px solid #0284c7; padding: 14px 18px; border-radius: 8px; margin: 20px 0;">
                  <div style="font-size: 12px; color: #64748b; font-weight: 800; text-transform: uppercase; margin-bottom: 4px;">Your Logged Message:</div>
                  <div style="font-size: 13.5px; color: #1e293b; font-style: italic;">"${senderMessage || ''}"</div>
                </div>
                <p style="color: #475569; font-size: 14px; line-height: 1.6;">
                  Our flight directors will review your transmission and get in touch with you shortly. If urgent, you can also reach our Student Coordinators directly:
                </p>
                <ul style="color: #334155; font-size: 13px; line-height: 1.8;">
                  <li><strong>Yashwanth H B:</strong> +91 80506 14849</li>
                  <li><strong>Chethan Kumar B:</strong> +91 99455 07099</li>
                </ul>
              </div>
              <div style="background: #f1f5f9; padding: 16px 24px; text-align: center; font-size: 11px; color: #64748b;">
                HAXLR8 3.0 • Dept. of Electronics & Communication Engineering • MIT Mysore
              </div>
            </div>
          `
        };
        await transporter.sendMail(participantMailOptions);
      } catch (autoReplyErr) {
        console.warn('Auto-reply notice:', autoReplyErr);
      }
    }

    return res.status(200).json({
      success: true,
      messageId: info.messageId,
      message: `Automated email successfully sent from ${hostEmail} to ${targetTo}`
    });
  } catch (error) {
    console.error('[HAXLR8 Email Error]:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Error dispatching automated email'
    });
  }
}
