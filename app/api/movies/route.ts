import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Movie from "@/models/Movie";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const category = searchParams.get("category");
    const genre = searchParams.get("genre");
    const year = searchParams.get("year");
    const quality = searchParams.get("quality");
    const language = searchParams.get("language");
    const trending = searchParams.get("trending");
    const featured = searchParams.get("featured");
    const topRated = searchParams.get("topRated");
    const platform = searchParams.get("platform");
    const search = searchParams.get("search");
    const sort = searchParams.get("sort") || "-createdAt";

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = { status: "active" };

    if (category) query.category = category;
    if (genre) query.genres = { $in: [genre] };
    if (year) query.releaseYear = parseInt(year);
    if (quality) query.quality = { $in: [quality] };
    if (language) query.language = language;
    if (trending === "true") query.isTrending = true;
    if (featured === "true") query.isFeatured = true;
    if (topRated === "true") query.isTopRated = true;
    if (platform) query.platform = platform;
    if (search) query.$text = { $search: search };

    const skip = (page - 1) * limit;
    const total = await Movie.countDocuments(query);
    const movies = await Movie.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .select("-downloadLinks -cast -gallery");

    return NextResponse.json({
      success: true,
      movies,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const body = await req.json();

    if (!body.slug) {
      body.slug = body.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    }

    const movie = await Movie.create(body);
    return NextResponse.json({ success: true, movie }, { status: 201 });
  } catch (error: any) {
    console.error("Movie creation error:", error);
    return NextResponse.json({ success: false, error: error.message || "Server error" }, { status: 500 });
  }
}
