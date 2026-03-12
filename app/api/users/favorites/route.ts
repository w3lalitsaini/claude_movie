import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session)
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );

    const { movieId } = await req.json();
    if (!movieId)
      return NextResponse.json(
        { success: false, error: "Movie ID is required" },
        { status: 400 },
      );

    await connectDB();
    const user = await User.findById(session.user.id);
    if (!user)
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 },
      );

    const index = user.favorites.indexOf(movieId);
    let added = false;

    if (index === -1) {
      user.favorites.push(movieId);
      added = true;
    } else {
      user.favorites.splice(index, 1);
    }
    await user.save();

    return NextResponse.json({
      success: true,
      added,
      favorites: user.favorites,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 },
    );
  }
}
