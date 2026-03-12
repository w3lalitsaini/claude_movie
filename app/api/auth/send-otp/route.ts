import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import OTP from "@/models/OTP";
import nodemailer from "nodemailer";
import crypto from "crypto";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email)
      return NextResponse.json(
        { success: false, error: "Email is required" },
        { status: 400 },
      );

    await connectDB();

    // Generate 6 digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const hashedOtp = await bcrypt.hash(otp, 10);

    // Save to DB (expires in 5 minutes)
    await OTP.findOneAndUpdate(
      { email: email.toLowerCase() },
      { otp: hashedOtp, expiresAt: new Date(Date.now() + 5 * 60 * 1000) },
      { upsert: true, new: true },
    );

    // Send Email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "sainilalit2751@gmail.com",
        pass: "oebzdjbxufvszkoh",
      },
    });

    const mailOptions = {
      from: '"AtoZ Movies" <sainilalit2751@gmail.com>',
      to: email,
      subject: "Your Authentication Hotkey - AtoZ Movies",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0a0a0a; color: #ffffff; padding: 20px; border-radius: 8px;">
          <h2 style="color: #e50914; text-transform: uppercase; text-align: center;">AtoZ Movies Auth</h2>
          <p style="color: #cccccc;">Hello,</p>
          <p style="color: #cccccc;">Here is your secure authentication hotkey. It is valid for 5 minutes.</p>
          <div style="background-color: #111111; border: 1px solid #333333; padding: 15px; text-align: center; font-size: 28px; font-weight: bold; letter-spacing: 8px; margin: 30px 0;">
            ${otp}
          </div>
          <p style="color: #666666; font-size: 12px; text-align: center;">If you didn't request this code, please ignore this email.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error("OTP Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send OTP. Please try again." },
      { status: 500 },
    );
  }
}
