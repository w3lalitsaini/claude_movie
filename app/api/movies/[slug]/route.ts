import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Movie from "@/models/Movie";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest, context: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await context.params;
    await connectDB();
    
    // Allow admins to see inactive movies
    const session = await getServerSession(authOptions);
    const query = (session?.user?.role === "admin") ? { slug } : { slug, status: "active" };
    
    const movie = await Movie.findOne(query);
    if (!movie) return NextResponse.json({ success: false, error: "Movie not found" }, { status: 404 });
    
    // Only increment views for public active movie views
    if (movie.status === "active" && session?.user?.role !== "admin") {
      await Movie.findByIdAndUpdate(movie._id, { $inc: { views: 1 } });
    }
    
    return NextResponse.json({ success: true, movie });
  } catch (error: any) {
    console.error("GET Movie Error:", error);
    return NextResponse.json({ success: false, error: error.message || "Server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, context: { params: Promise<{ slug: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    
    const { slug } = await context.params;
    await connectDB();
    const body = await req.json();
    
    // Remove _id and __v if they exist to prevent Mongoose errors
    // eslint-disable-next-line no-unused-vars
    const { _id, __v, ...updateData } = body;
    
    const movie = await Movie.findOneAndUpdate({ slug }, updateData, { returnDocument: "after" });
    if (!movie) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    
    return NextResponse.json({ success: true, movie });
  } catch (error: any) {
    console.error("PUT Movie Error:", error);
    return NextResponse.json({ success: false, error: error.message || "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ slug: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    
    const { slug } = await context.params;
    await connectDB();
    await Movie.findOneAndDelete({ slug });
    return NextResponse.json({ success: true, message: "Movie deleted" });
  } catch (error: any) {
    console.error("DELETE Movie Error:", error);
    return NextResponse.json({ success: false, error: error.message || "Server error" }, { status: 500 });
  }
}
