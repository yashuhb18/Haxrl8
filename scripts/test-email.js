import nodemailer from 'nodemailer';
import fs from 'fs';

// Read .env if available
let hostEmail = process.env.HOST_EMAIL || 'haxlr8ecemitm@gmail.com';
let hostPassword = process.env.HOST_EMAIL_PASSWORD || 'qqucyshfxeckzqxl';

if (fs.existsSync('.env')) {
  const env = fs.readFileSync('.env', 'utf8');
  env.split('\n').forEach(line => {
    if (line.startsWith('HOST_EMAIL=')) hostEmail = line.split('=')[1].trim();
    if (line.startsWith('HOST_EMAIL_PASSWORD=')) hostPassword = line.split('=')[1].trim();
  });
}

const targetTo = process.argv[2] || 'yashuhb18@gmail.com';

console.log(`Testing SMTP connection for ${hostEmail} with password ending in ...${hostPassword.slice(-4)}`);
console.log(`Target recipient: ${targetTo}`);

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: hostEmail,
    pass: hostPassword.replace(/\s+/g, '')
  }
});

async function run() {
  try {
    console.log('1. Verifying SMTP authentication with Google...');
    await transporter.verify();
    console.log('✓ Google SMTP Authentication SUCCESSFUL!');

    console.log('2. Sending demo email to ' + targetTo + '...');
    const info = await transporter.sendMail({
      from: `"HAXLR8 3.0 Space Command" <${hostEmail}>`,
      to: targetTo,
      subject: '🚀 HAXLR8 3.0 Mail Delivery Verification Test',
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; max-width: 600px;">
          <h2 style="color: #0f172a; margin: 0 0 10px 0;">🚀 HAXLR8 3.0 Email Service Active</h2>
          <p style="color: #475569; font-size: 14px; line-height: 1.6;">
            This is a verified test email sent from <strong>${hostEmail}</strong> to <strong>${targetTo}</strong>.
          </p>
          <div style="background: #f0fdf4; border-left: 4px solid #16a34a; padding: 10px 14px; border-radius: 6px; color: #166534; font-size: 13px; font-weight: bold; margin: 16px 0;">
            ✓ SMTP Connection &amp; Authentication Verified!
          </div>
          <p style="color: #94a3b8; font-size: 12px; margin: 0;">Dispatched on ${new Date().toLocaleString()}</p>
        </div>
      `
    });
    console.log('✓ Email delivered successfully!');
    console.log('Message ID:', info.messageId);
    process.exit(0);
  } catch (err) {
    console.error('✗ Delivery Failed:');
    console.error(err.message || err);
    process.exit(1);
  }
}

run();
