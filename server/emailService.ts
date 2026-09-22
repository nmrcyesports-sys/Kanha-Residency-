import nodemailer from 'nodemailer';
import type { Transporter, TestAccount } from 'nodemailer';
import { db } from './db.js';
import type { Booking, Enquiry } from '../src/types';

interface EmailSendResult {
  success: boolean;
  messageId?: string;
  previewUrl?: string | false;
  error?: string;
  recipient: string;
}

class EmailService {
  private transporter: Transporter | null = null;
  private testAccount: TestAccount | null = null;

  private async getTransporter(): Promise<Transporter> {
    const settings = db.getSettings();
    const smtpSettings = settings?.smtp_config;

    // 1. Resolve environment variables
    const envUser = process.env.EMAIL_FROM || process.env.EMAIL_USER || process.env.SMTP_USER;
    const rawEnvPass = process.env.EMAIL_API_KEY || process.env.EMAIL_PASS || process.env.SMTP_PASS || '';
    const envPass = rawEnvPass ? rawEnvPass.replace(/\s+/g, '') : undefined;
    const envHost = process.env.SMTP_HOST || (envUser && envUser.includes('@gmail.com') ? 'smtp.gmail.com' : undefined);
    const envPort = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 465;
    const envSecure = process.env.SMTP_SECURE === 'true' || envPort === 465;

    // 2. Resolve settings from DB or environment
    const user = smtpSettings?.user || envUser;
    const rawPass = smtpSettings?.pass ? smtpSettings.pass : envPass;
    const pass = rawPass ? rawPass.replace(/\s+/g, '') : undefined;
    const host = smtpSettings?.host || envHost || 'smtp.gmail.com';
    const port = smtpSettings?.port || envPort || 465;
    const secure = smtpSettings?.secure ?? (port === 465 || envSecure);

    // 3. Connect real SMTP transport (Gmail or custom host)
    if (user && pass) {
      if (host === 'smtp.gmail.com' || user.toLowerCase().endsWith('@gmail.com')) {
        console.log(`[EmailService] Using Gmail SMTP transport with user: ${user}`);
        return nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user,
            pass,
          },
        });
      }

      console.log(`[EmailService] Using custom SMTP transport: ${host}:${port}`);
      return nodemailer.createTransport({
        host,
        port,
        secure,
        auth: {
          user,
          pass,
        },
        tls: {
          rejectUnauthorized: false,
        },
      });
    }

    // 4. Fallback: Ethereal test account for sandbox preview without credentials
    if (!this.testAccount) {
      try {
        this.testAccount = await nodemailer.createTestAccount();
        console.log('[EmailService] Created ethereal test account:', this.testAccount.user);
      } catch (err) {
        console.warn('[EmailService] Could not create Ethereal account, falling back to direct transport');
      }
    }

    if (this.testAccount) {
      return nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: this.testAccount.user,
          pass: this.testAccount.pass,
        },
      });
    }

    // Default basic stream transport if all else fails
    return nodemailer.createTransport({
      streamTransport: true,
      newline: 'unix',
      buffer: true,
    });
  }

  public async sendEmail(options: {
    to: string;
    subject: string;
    text: string;
    html?: string;
    templateName?: string;
    relatedBooking?: string;
  }): Promise<EmailSendResult> {
    const { to, subject, text, html, templateName = 'General', relatedBooking } = options;
    const now = new Date().toISOString();

    const user = process.env.EMAIL_FROM || process.env.EMAIL_USER || 'aurateqmarket@gmail.com';
    const fromAddress =
      process.env.SMTP_FROM ||
      `"Kanha Residency Mathura" <${user}>`;
    const replyTo = process.env.EMAIL_REPLY_TO || user;

    try {
      const transporter = await this.getTransporter();
      const info = await transporter.sendMail({
        from: fromAddress,
        replyTo,
        to,
        subject,
        text,
        html: html || text.replace(/\n/g, '<br/>'),
      });

      const previewUrl = nodemailer.getTestMessageUrl(info);

      console.log(`[EmailService] Email dispatched to ${to}. MessageId: ${info.messageId}`);
      if (previewUrl) {
        console.log(`[EmailService] Preview URL: ${previewUrl}`);
      }

      // Record to db email logs
      db.recordEmailLog({
        id: `eml_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        recipient: to,
        subject,
        template_name: templateName,
        status: 'Sent',
        sent_time: now,
        related_booking: relatedBooking,
        body: text,
      });

      return {
        success: true,
        messageId: info.messageId,
        previewUrl: previewUrl || undefined,
        recipient: to,
      };
    } catch (err: any) {
      console.error(`[EmailService] Failed to send email to ${to}:`, err);

      // Record failed email log
      db.recordEmailLog({
        id: `eml_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        recipient: to,
        subject,
        template_name: templateName,
        status: 'Failed',
        sent_time: now,
        related_booking: relatedBooking,
        body: text,
        error: err.message || 'SMTP delivery failure',
      });

      return {
        success: false,
        error: err.message || 'Failed to dispatch email',
        recipient: to,
      };
    }
  }

  public async sendBookingConfirmation(booking: Booking): Promise<EmailSendResult> {
    const guest = booking.guest;
    const subject = `Confirmed: Your Stay at Kanha Residency (ID: ${booking.booking_number})`;

    const plainText = `Namaste ${guest.full_name},

We are delighted to confirm your upcoming reservation at Kanha Residency, Mathura.

RESERVATION DETAILS:
• Booking Reference: ${booking.booking_number}
• Reserved Suite: ${booking.room_name}
• Check-in: ${booking.check_in} (from 14:00 PM)
• Check-out: ${booking.check_out} (until 11:00 AM)
• Stay Duration: ${booking.nights} Night(s)
• Total Guests: ${booking.guests}
• Total Amount: ₹${booking.total} (GST 12% included)
• Payment Status: ${booking.payment_status} (${booking.payment_method})

PILGRIMAGE CONCIERGE & LOCAL GUIDANCE:
• Shri Krishna Janmabhoomi: 10 mins distance (Morning Aarti: 05:30 AM)
• Dwarkadhish Temple & Vishram Ghat: Evening Yamuna Aarti at 07:00 PM
• Pure Vegetarian & Satvik In-Room Dining Available 24/7

PROPERTY ADDRESS:
Kanha Residency, CMWM+RJX, Techman Nilgiri, Mathura, Uttar Pradesh 281006
Concierge Line: +91 98970 12345
Email: reservations@kanharesidency.com

Warm regards & Jai Shri Krishna,
Kanha Residency Hospitality Team`;

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #0A0B0D; color: #FAF7F2; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background-color: #141518; border-radius: 16px; border: 1px solid #332E27; overflow: hidden; }
    .header { background-color: #191B22; padding: 32px 24px; text-align: center; border-bottom: 2px solid #C5A880; }
    .logo-badge { font-size: 11px; letter-spacing: 0.25em; text-transform: uppercase; color: #C5A880; margin-bottom: 8px; font-weight: bold; }
    .title { font-size: 26px; color: #FAF7F2; margin: 0; font-family: Georgia, serif; }
    .body { padding: 32px 24px; }
    .salutation { font-size: 18px; color: #FAF7F2; margin-bottom: 16px; }
    .lead { font-size: 14px; color: #C4B8A9; line-height: 1.6; margin-bottom: 24px; }
    .card { background-color: #1A1C23; border: 1px solid #2D2822; border-radius: 12px; padding: 20px; margin-bottom: 24px; }
    .card-title { font-size: 12px; letter-spacing: 0.15em; text-transform: uppercase; color: #E5C79E; margin-top: 0; margin-bottom: 12px; font-weight: bold; }
    .row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #24221D; font-size: 13px; }
    .row-last { border-bottom: none; }
    .label { color: #8C8377; }
    .value { color: #FAF7F2; font-weight: 600; text-align: right; }
    .total-row { padding-top: 10px; margin-top: 6px; border-top: 1px dashed #C5A880; font-size: 16px; }
    .total-value { color: #E5C79E; font-size: 18px; font-weight: bold; }
    .info-box { background-color: #1F1D19; border-left: 3px solid #C5A880; padding: 14px 16px; border-radius: 0 8px 8px 0; margin-bottom: 24px; font-size: 13px; color: #D8CFBF; line-height: 1.5; }
    .footer { background-color: #0E0F12; padding: 20px; text-align: center; font-size: 11px; color: #6E675D; border-top: 1px solid #22201C; }
    .footer a { color: #C5A880; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo-badge">Sacred Hospitality · Mathura</div>
      <h1 class="title">Kanha Residency</h1>
    </div>
    <div class="body">
      <div class="salutation">Namaste ${guest.full_name},</div>
      <p class="lead">We are honored to confirm your upcoming reservation. Your booking has been secured and our concierge team is preparing for your arrival in sacred Braj Bhumi.</p>
      
      <div class="card">
        <div class="card-title">Reservation Summary</div>
        <div class="row"><span class="label">Booking ID:</span><span class="value" style="color: #C5A880; font-family: monospace;">${booking.booking_number}</span></div>
        <div class="row"><span class="label">Reserved Suite:</span><span class="value">${booking.room_name}</span></div>
        <div class="row"><span class="label">Check-In:</span><span class="value">${booking.check_in} (from 14:00)</span></div>
        <div class="row"><span class="label">Check-Out:</span><span class="value">${booking.check_out} (by 11:00 AM)</span></div>
        <div class="row"><span class="label">Duration & Guests:</span><span class="value">${booking.nights} Night(s) · ${booking.guests} Guest(s)</span></div>
        <div class="row"><span class="label">Payment Status:</span><span class="value" style="color: #4ade80;">${booking.payment_status} (${booking.payment_method})</span></div>
        <div class="row row-last total-row"><span class="label" style="color: #FAF7F2; font-weight: bold;">Total Amount:</span><span class="total-value">₹${booking.total}</span></div>
      </div>

      <div class="info-box">
        <strong>Sacred Braj Pilgrimage Concierge:</strong><br/>
        • Shri Krishna Janmabhoomi: 10 mins away<br/>
        • Vishram Ghat Evening Yamuna Aarti: 07:00 PM<br/>
        • Pure vegetarian satvik dining & temple transfers available upon request.
      </div>

      <p style="font-size: 13px; color: #8C8377; line-height: 1.5;">
        <strong>Address:</strong> Kanha Residency, CMWM+RJX, Techman Nilgiri, Mathura, UP 281006<br/>
        <strong>Front Desk 24/7:</strong> +91 98970 12345 | reservations@kanharesidency.com
      </p>
    </div>
    <div class="footer">
      © ${new Date().getFullYear()} Kanha Residency Mathura. All rights reserved.<br/>
      <a href="https://kanharesidency.com">Visit Website</a> · <a href="https://maps.google.com/?q=Kanha+Residency+Mathura">Directions on Google Maps</a>
    </div>
  </div>
</body>
</html>`;

    return this.sendEmail({
      to: guest.email,
      subject,
      text: plainText,
      html: htmlContent,
      templateName: 'Booking Confirmed',
      relatedBooking: booking.booking_number,
    });
  }

  public async sendBookingCancellation(booking: Booking): Promise<EmailSendResult> {
    const guest = booking.guest;
    const subject = `Cancelled: Reservation #${booking.booking_number} - Kanha Residency`;

    const plainText = `Namaste ${guest.full_name},

Your reservation #${booking.booking_number} for ${booking.room_name} at Kanha Residency has been cancelled as requested.

CANCELLATION SUMMARY:
• Booking Number: ${booking.booking_number}
• Reserved Dates: ${booking.check_in} to ${booking.check_out}
• Refund Status: ₹${booking.total} refund initiated to original payment method
• Refund Processing Window: 3-5 business days

We hope to have the honor of hosting you in Mathura in the near future.

Warm regards,
Kanha Residency Reservations Desk
Phone: +91 98970 12345`;

    return this.sendEmail({
      to: guest.email,
      subject,
      text: plainText,
      templateName: 'Booking Cancelled',
      relatedBooking: booking.booking_number,
    });
  }

  public async sendEnquiryReceipt(enquiry: Enquiry): Promise<EmailSendResult> {
    const subject = `Received: Your Pilgrimage Enquiry - Kanha Residency Mathura`;
    const plainText = `Namaste ${enquiry.name},

Thank you for reaching out to Kanha Residency, Mathura.

We have received your enquiry:
"${enquiry.message}"

Our hospitality manager will contact you at ${enquiry.phone || enquiry.email} shortly to assist with your stay, dates, and pilgrimage itinerary.

Warm regards,
Kanha Residency Concierge Desk`;

    return this.sendEmail({
      to: enquiry.email,
      subject,
      text: plainText,
      templateName: 'Enquiry Received',
    });
  }
}

export const emailService = new EmailService();
