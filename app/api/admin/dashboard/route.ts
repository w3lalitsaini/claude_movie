import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Movie from "@/models/Movie";
import User from "@/models/User";
import Review from "@/models/Review";
import Blog from "@/models/Blog";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    await connectDB();

    const [movies, users, reviews, blogs] = await Promise.all([
      Movie.countDocuments(),
      User.countDocuments(),
      Review.countDocuments(),
      Blog.countDocuments().catch(() => 0),
    ]);

    const recentMoviesRaw = await Movie.find().sort({ createdAt: -1 }).limit(5);
    const recentMovies = recentMoviesRaw.map((m) => ({
      title: m.title,
      category: m.category || "Unknown",
      date: m.createdAt.toISOString().split("T")[0],
      views: m.views || 0,
      rating: m.rating || 0,
    }));

    const recentUsersRaw = await User.find().sort({ createdAt: -1 }).limit(4);
    const recentUsers = recentUsersRaw.map((u) => ({
      name: u.name,
      email: u.email,
      joined: u.createdAt.toISOString().split("T")[0],
      reviews: 0,
    }));

    return NextResponse.json({
      success: true,
      stats: { movies, users, reviews, blogs },
      recentMovies,
      recentUsers,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 },
    );
  }
}
