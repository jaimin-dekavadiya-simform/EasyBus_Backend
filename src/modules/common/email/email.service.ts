import ApiError from '@/utils/apiError';
import nodemailer from 'nodemailer';
import { SendEmailOptions } from '@/modules/common/email/mailer.types';
import { compileVerificationMailTemplate } from './email.templates';
import { config } from '@/config/env';
import { generateJwtToken } from '../../core/auth/auth.utils';
import { User } from '@/generated/prisma/client';
import { HttpStatusCode } from '@/types/utils.types';
import { logger } from '@/utils/logger';
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

export const sendVerificationMail = async (user: User): Promise<void> => {
  const emailVerificationToken = generateJwtToken(
    { userId: user.id },
    config.jwt.verification.secret,
    config.jwt.verification.expiry,
  );
  const baseUrl = config.jwt.verification.baseUrl;
  if (!baseUrl) {
    throw new ApiError(
      HttpStatusCode.INTERNAL_SERVER_ERROR,
      'base url missing in environment variables',
    );
  }
  const url = `${baseUrl}/api/auth/verifyEmail?token=${emailVerificationToken}`;
  const html = compileVerificationMailTemplate({ url, name: user.firstName });
  await sendEmail({ to: user.email, subject: 'Email Verification', html: html }).catch((err) => {
    logger.error(err, 'Email Service Failed');
  });
};
