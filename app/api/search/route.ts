import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Movie from "@/models/Movie";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q");
    const genre = searchParams.get("genre");
    const year = searchParams.get("year");
    const language = searchParams.get("language");
    const rating = searchParams.get("rating");
    const quality = searchParams.get("quality");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = { status: "active" };

    if (q) query.$text = { $search: q };
    if (genre) query.genres = { $in: [genre] };
    if (year) query.releaseYear = parseInt(year);
    if (language) query.language = language;
    if (rating) query.rating = { $gte: parseFloat(rating) };
    if (quality) query.quality = { $in: [quality] };

    const skip = (page - 1) * limit;
    const total = await Movie.countDocuments(query);
    const movies = await Movie.find(query)
      .sort(q ? { score: { $meta: "textScore" } } : "-createdAt")
      .skip(skip)
      .limit(limit)
      .select("title slug poster rating genres releaseYear quality category");

    return NextResponse.json({ success: true, movies, total, pages: Math.ceil(total / limit) });
  } catch {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
