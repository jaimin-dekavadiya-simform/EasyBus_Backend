import { randomBytes, createHash } from 'node:crypto';
import bcrypt from 'bcrypt';

export const generateToken = () => {
  return randomBytes(32).toString('hex');
};
export const hashPassword = async (pass: string) => {
  return bcrypt.hash(pass, 10);
};
export const hashToken = (token: string) => {
  return createHash('sha256').update(token).digest('hex');
};
