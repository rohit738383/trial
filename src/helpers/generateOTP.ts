import crypto from 'crypto';

export function generateSecureOTP(length = 6): string {
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < length; i++) {
    const idx = crypto.randomInt(0, digits.length);
    otp += digits[idx];
  }
  return otp;
}
