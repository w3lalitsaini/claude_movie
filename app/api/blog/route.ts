import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Blog from "@/models/Blog";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "9");
    const tag = searchParams.get("tag");
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const session = await getServerSession(authOptions);
    const query: any = (session?.user?.role === "admin" || session?.user?.role === "moderator") ? {} : { status: "published" };
    
    if (tag) query.tags = { $in: [tag] };
    if (category) query.category = category;
    if (search) query.$text = { $search: search };

    const skip = (page - 1) * limit;
    const total = await Blog.countDocuments(query);
    const posts = await Blog.find(query)
      .populate("author", "name avatar")
      .sort(search ? { score: { $meta: "textScore" } } : "-createdAt")
      .skip(skip)
      .limit(limit)
      .select("-content");

    return NextResponse.json({ success: true, posts, total, pages: Math.ceil(total / limit) });
  } catch {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== "admin" && session.user.role !== "moderator")) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const body = await req.json();
    if (!body.slug) {
      body.slug = body.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    }
    body.author = session.user.id;

    const post = await Blog.create(body);
    return NextResponse.json({ success: true, post }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
