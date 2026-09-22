import nodemailer from 'nodemailer';
import type { Transporter, TestAccount } from 'nodemailer';
import { db } from './db.js';
import type { Booking, Enquiry } from '../src/types';
import {
  generateBookingConfirmedEmail,
  generateBookingCancelledEmail,
  generateEnquiryReceivedEmail,
} from './emailTemplates.js';

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
        html: html || text.replace(/\n/g, '<br/>'),
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
        html: html || text.replace(/\n/g, '<br/>'),
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
    const settings = db.getSettings();
    const { subject, text, html } = generateBookingConfirmedEmail(booking, settings);

    return this.sendEmail({
      to: booking.guest.email,
      subject,
      text,
      html,
      templateName: 'Booking Confirmed',
      relatedBooking: booking.booking_number,
    });
  }

  public async sendBookingCancellation(booking: Booking): Promise<EmailSendResult> {
    const settings = db.getSettings();
    const { subject, text, html } = generateBookingCancelledEmail(booking, settings);

    return this.sendEmail({
      to: booking.guest.email,
      subject,
      text,
      html,
      templateName: 'Booking Cancelled',
      relatedBooking: booking.booking_number,
    });
  }

  public async sendEnquiryReceipt(enquiry: Enquiry): Promise<EmailSendResult> {
    const settings = db.getSettings();
    const { subject, text, html } = generateEnquiryReceivedEmail(enquiry, settings);

    return this.sendEmail({
      to: enquiry.email,
      subject,
      text,
      html,
      templateName: 'Enquiry Received',
    });
  }
}

export const emailService = new EmailService();
