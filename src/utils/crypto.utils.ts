import { randomBytes, createHash } from 'node:crypto';
import bcrypt from 'bcrypt';

export const generateToken = (): string => {
  return randomBytes(32).toString('hex');
};
export const hashPassword = async (pass: string): Promise<string> => {
  return bcrypt.hash(pass, 10);
};
export const hashToken = (token: string): string => {
  return createHash('sha256').update(token).digest('hex');
};
export const comparePasswordHash = async (
  password: string,
  passwordHash: string,
): Promise<boolean> => {
  return bcrypt.compare(password, passwordHash);
};
