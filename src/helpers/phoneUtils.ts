import { parsePhoneNumberFromString } from 'libphonenumber-js';

export function formatPhoneNumber(inputNumber: string) {
  const phoneNumber = parsePhoneNumberFromString(inputNumber, 'IN');
  if (!phoneNumber || !phoneNumber.isValid()) {
    throw new Error('Invalid phone number');
  }
  return phoneNumber.format('E.164');
}
