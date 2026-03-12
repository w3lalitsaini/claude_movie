import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import Review from "@/models/Review";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    await connectDB();

    // Fetch all users
    const users = await User.find().sort("-createdAt").lean();

    // For each user, count their reviews
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const reviewsCount = await Review.countDocuments({ user: user._id });
        return {
          ...user,
          reviews: reviewsCount,
          joinedAt: user.createdAt
            ? new Date(user.createdAt).toISOString().split("T")[0]
            : "N/A",
        };
      }),
    );

    return NextResponse.json({ success: true, users: usersWithStats });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 },
    );
  }
}
