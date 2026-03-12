import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import BlogComment from "@/models/BlogComment";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const blogId = searchParams.get("blogId");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const query = blogId ? { blog: blogId, isApproved: true } : { isApproved: true };
    const skip = (page - 1) * limit;

    const comments = await BlogComment.find(query)
      .populate("user", "name avatar")
      .sort("-createdAt")
      .skip(skip)
      .limit(limit);

    const total = await BlogComment.countDocuments(query);
    return NextResponse.json({ success: true, comments, total });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ success: false, error: "Login required" }, { status: 401 });

    await connectDB();
    const body = await req.json();

    if (!body.blogId || !body.content) {
      return NextResponse.json({ success: false, error: "Missing fields" }, { status: 400 });
    }

    const comment = await BlogComment.create({
      blog: body.blogId,
      user: session.user.id,
      content: body.content,
    });

    const populated = await comment.populate("user", "name avatar");
    return NextResponse.json({ success: true, comment: populated }, { status: 201 });
  } catch (error: any) {
    console.error("Comment error:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
