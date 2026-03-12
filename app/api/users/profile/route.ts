import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

import Review from "@/models/Review";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const user = await User.findById(session.user.id).lean();

    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    const reviewsCount = await Review.countDocuments({ user: session.user.id });

    return NextResponse.json({
      success: true,
      stats: {
        watchlist: user.watchlist?.length || 0,
        favorites: user.favorites?.length || 0,
        reviews: reviewsCount,
      }
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session)
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );

    const { name } = await req.json();
    if (!name)
      return NextResponse.json(
        { success: false, error: "Name is required" },
        { status: 400 },
      );

    await connectDB();
    const user = await User.findByIdAndUpdate(
      session.user.id,
      { name },
      { new: true },
    );

    if (!user)
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 },
      );

    return NextResponse.json(
      {
        success: true,
        message: "Profile updated successfully",
        user: { name: user.name },
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session)
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );

    await connectDB();
    const user = await User.findByIdAndDelete(session.user.id);

    if (!user)
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 },
      );

    return NextResponse.json(
      { success: true, message: "Account deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 },
    );
  }
}
