import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/db";
import User from "@/models/User";
import OTP from "@/models/OTP";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { name, email, password, otp } = await req.json();

    if (!name || !email || !password || !otp) {
      return NextResponse.json(
        { success: false, error: "All fields and Hotkey required" },
        { status: 400 },
      );
    }

    const emailLower = email.toLowerCase();
    const exists = await User.findOne({ email: emailLower });
    if (exists) {
      return NextResponse.json(
        { success: false, error: "Email already registered" },
        { status: 400 },
      );
    }

    // Verify OTP
    const otpRecord = await OTP.findOne({ email: emailLower });
    if (!otpRecord) {
      return NextResponse.json(
        { success: false, error: "Invalid or expired Hotkey" },
        { status: 400 },
      );
    }

    const isOtpValid = await bcrypt.compare(otp, otpRecord.otp);
    if (!isOtpValid) {
      return NextResponse.json(
        { success: false, error: "Incorrect Hotkey" },
        { status: 400 },
      );
    }

    // OTP is valid! Delete it so it can't be reused
    await OTP.deleteOne({ _id: otpRecord._id });

    const hashed = await bcrypt.hash(password, 12);
    const user = await User.create({
      name,
      email: emailLower,
      password: hashed,
      isVerified: true,
    });

    return NextResponse.json(
      {
        success: true,
        user: { id: user._id, name: user.name, email: user.email },
      },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 },
    );
  }
}
