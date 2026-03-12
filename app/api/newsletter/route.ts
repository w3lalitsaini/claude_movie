import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Newsletter from "@/models/Newsletter";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email)
      return NextResponse.json(
        { success: false, error: "Email is required" },
        { status: 400 },
      );

    await connectDB();
    const existing = await Newsletter.findOne({ email: email.toLowerCase() });
    if (existing) {
      return NextResponse.json(
        { success: false, error: "Already subscribed" },
        { status: 400 },
      );
    }

    await Newsletter.create({ email: email.toLowerCase() });
    return NextResponse.json(
      { success: true, message: "Subscribed successfully" },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 },
    );
  }
}
