import { NextResponse } from "next/server";
import User from "@/models/User";
import OTP from "@/models/OTP";
import dbConnect from "@/lib/db";

export async function POST(req: Request) {
  try {
    await dbConnect();

    const { name, email, password, otp } = await req.json();

    const otpRecord = await OTP.findOne({ email });

    if (!otpRecord) {
      return NextResponse.json({ message: "OTP expired" }, { status: 400 });
    }

    if (otpRecord.otp !== otp) {
      return NextResponse.json({ message: "Invalid OTP" }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 },
      );
    }

    const user = await User.create({
      name,
      email,
      password,
      isVerified: true,
    });

    await OTP.deleteMany({ email });

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
