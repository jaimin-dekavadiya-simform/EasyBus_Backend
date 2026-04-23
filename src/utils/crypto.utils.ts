import { randomBytes } from 'node:crypto';
import bcrypt from 'bcrypt';
export function generateToken() {
  return randomBytes(32).toString('hex');
}
export async function hashToken(pass: string) {
  return bcrypt.hash(pass, 10);
}
