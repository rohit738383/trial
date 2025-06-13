import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { sendVerificationSMS } from '@/helpers/sendVerificationSMS';
import { generateSecureOTP } from '@/helpers/generateOTP';
import { formatPhoneNumber } from '@/helpers/phoneUtils'; 

export async function POST(request: Request) {
 
  try {
    const { username } = await request.json();

    const user = await prisma.user.findUnique({
      where: { username: decodeURIComponent(username) },
    });
    
    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    if (user.isVerified) {
      return NextResponse.json({ success: false, message: 'User already verified' }, { status: 400 });
    }


    if (user.verifyCodeExpiry && user.verifyCodeExpiry > new Date()) {
      return NextResponse.json(
        {
          success: false,
          message: 'OTP already sent recently. Please wait 15 minutes before requesting again.',
        },
        { status: 429 }
      );
    }

    const verifyCode = generateSecureOTP();
    const expiry = new Date(Date.now() + 15 * 60 * 1000); 


    await prisma.user.update({
      where: { id: user.id },
      data: {
        verifyCode,
        verifyCodeExpiry: expiry,
      },
    });

    const formattedPhone = formatPhoneNumber(user.phoneNumber); 
    const smsResponse = await sendVerificationSMS(formattedPhone, user.username, verifyCode);

    if (!smsResponse.success) {
      return NextResponse.json({ success: false, message: smsResponse.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'OTP resent successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error resending OTP:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
