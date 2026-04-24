import nodemailer from 'nodemailer';
import { SendEmailOptions, VerificationMailData } from '@/types/mailer.types';
import { compileVerificationMailTemplate } from './email.templates';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendEmail = async (options: SendEmailOptions): Promise<void> => {
  await transporter.sendMail({
    from: `"EasyBus" <${process.env.EMAIL_USER}>`,
    to: options.to,
    subject: options.subject,
    html: options.html,
    text: options.text,
  });
};

export class EmailService {
  static sendVerificationMail(email: string, data: VerificationMailData): void {
    const html = compileVerificationMailTemplate(data);
    sendEmail({ to: email, subject: 'Email Verification', html: html }).catch((err) => {
      console.log('Email Servie Failed ', err);
    });
  }
}
