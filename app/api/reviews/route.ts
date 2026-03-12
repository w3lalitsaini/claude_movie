import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Review from "@/models/Review";
import Movie from "@/models/Movie";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const movieId = searchParams.get("movieId");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const query = movieId ? { movie: movieId, isApproved: true } : { isApproved: true };
    const skip = (page - 1) * limit;

    const reviews = await Review.find(query)
      .populate("user", "name avatar")
      .sort("-createdAt")
      .skip(skip)
      .limit(limit);

    const total = await Review.countDocuments(query);
    return NextResponse.json({ success: true, reviews, total });
  } catch {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ success: false, error: "Login required" }, { status: 401 });

    await connectDB();
    const body = await req.json();

    const existing = await Review.findOne({ movie: body.movieId, user: session.user.id });
    if (existing) return NextResponse.json({ success: false, error: "Already reviewed" }, { status: 400 });

    const review = await Review.create({
      movie: body.movieId,
      user: session.user.id,
      rating: body.rating,
      title: body.title,
      content: body.content,
    });

    // Update movie review count and avg rating
    const reviews = await Review.find({ movie: body.movieId, isApproved: true });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await Movie.findByIdAndUpdate(body.movieId, {
      rating: Math.round(avgRating * 10) / 10,
      reviewCount: reviews.length,
    });

    const populated = await review.populate("user", "name avatar");
    return NextResponse.json({ success: true, review: populated }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const { searchParams } = new URL(req.url);
    const reviewId = searchParams.get("id");

    const review = await Review.findById(reviewId);
    if (!review) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });

    if (review.user.toString() !== session.user.id && session.user.role !== "admin") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await Review.findByIdAndDelete(reviewId);
    return NextResponse.json({ success: true, message: "Deleted" });
  } catch {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
