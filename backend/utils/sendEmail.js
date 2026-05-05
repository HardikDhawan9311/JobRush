const { BrevoClient } = require('@getbrevo/brevo');
require('dotenv').config();

const sendEmail = async (options) => {
  try {
    const client = new BrevoClient({ 
      apiKey: process.env.BREVO_API_KEY 
    });

    const emailData = {
      subject: options.subject,
      htmlContent: `<html><body><div style="font-family: Arial, sans-serif; padding: 30px; border: 1px solid #eef2f6; border-radius: 16px; background-color: #ffffff; max-width: 600px; margin: 0 auto;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #3b82f6; margin: 0; font-size: 28px;">JobRush</h1>
        </div>
        <div style="font-size: 16px; line-height: 1.6; color: #1e293b;">
          ${options.message}
        </div>
        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center; color: #64748b; font-size: 12px;">
          <p>© 2026 JobRush. All rights reserved.</p>
          <p>If you didn't expect this email, please contact support.</p>
        </div>
      </div></body></html>`,
      sender: { "name": process.env.SENDER_NAME || "JobRush Team", "email": process.env.SENDER_EMAIL },
      to: [{ "email": options.email }]
    };

    const response = await client.transactionalEmails.sendTransacEmail(emailData);
    console.log('Email sent successfully via Brevo. Message ID:', response.messageId || 'N/A');
    return response;
  } catch (error) {
    console.error('Brevo API Error Detail:', error.message);
    throw new Error(error.message);
  }
};

module.exports = sendEmail;
