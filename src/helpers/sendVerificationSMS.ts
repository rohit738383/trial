import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID!;
const authToken = process.env.TWILIO_AUTH_TOKEN!;
const fromPhone = process.env.TWILIO_PHONE_NUMBER!;

const client = twilio(accountSid, authToken);

export async function sendVerificationSMS(
  phoneNumber: string,
  username: string,
  verifyCode: string
): Promise<{ success: boolean; message: string }> {
  try {
    await client.messages.create({
      body: `Hi ${username}, your OTP is: ${verifyCode}`,
      from: fromPhone,
      to: phoneNumber, // formatted E.164 number with +91 etc.
    });

    return { success: true, message: 'Verification SMS sent successfully.' };
  } catch (error) {
    console.error('Twilio SMS error:', error);
    return { success: false, message: 'Failed to send verification SMS.' };
  }
}
