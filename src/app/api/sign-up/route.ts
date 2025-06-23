import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { sendVerificationSMS } from '@/helpers/sendVerificationSMS';
import { generateSecureOTP } from '@/helpers/generateOTP';
import { formatPhoneNumber } from '@/helpers/phoneUtils';

export async function POST(request: Request) {

  try {
    const {fullName, username, phoneNumber, email, password } = await request.json();
    console.log("Phone Number received :", phoneNumber);


    let formattedPhone: string;
    
    try {
      formattedPhone = formatPhoneNumber(phoneNumber);
    } catch (error) {
      console.error(error);
      return NextResponse.json(
        { success: false, message: 'Invalid phone number' },
        { status: 400 }
      );
    }

    const existingVerifiedUserByUsername = await prisma.user.findFirst({
      where: {
        username,
        isVerified: true,
      },
    });

    if (existingVerifiedUserByUsername) {
      return NextResponse.json(
        {
          success: false,
          message: 'Username is already taken',
        },
        { status: 400 }
      );
    }


    const verifyCode = generateSecureOTP();
    const verifyCodeExpiry = new Date(Date.now() + 15 * 60 * 1000);

    const existingUserByPhone = await prisma.user.findUnique({ where: { 
      phoneNumber,
     },
     });
  
  
    if (existingUserByPhone) {
      if (existingUserByPhone.isVerified) {
        return NextResponse.json(
          {
            success: false,
            message: 'User already exists with this PhoneNumber',
          },
          { status: 400 }
        );
      }  else {

    if (existingUserByPhone.verifyCodeExpiry && existingUserByPhone.verifyCodeExpiry > new Date()) {
      return NextResponse.json(
        {
          success: false,
          message: 'An account with this number exists but isn\'t verified Please wait some time and sign-up again',
        },
        { status: 429 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.update({
      where: { phoneNumber },
      data: {
        fullName,
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry,
      },
    });
  }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setTime(expiryDate.getTime() + 15 * 60 * 1000);

      await prisma.user.create({
        data: {
          fullName,
          username,
          phoneNumber,
          email,
          password: hashedPassword,
          verifyCode,
          verifyCodeExpiry,
          isVerified: false,
          role: 'USER', 
        },
      });
    }

    // Send verification sms


    const smsResponse = await sendVerificationSMS(
      formattedPhone,
      username,
      verifyCode
    );
    if (!smsResponse.success) {
      return NextResponse.json(
        {
          success: false,
          message: smsResponse.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'User registered successfully. Please verify your account.',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error registering user',
      },
      { status: 500 }
    );
  }
}







