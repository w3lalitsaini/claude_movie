import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const user = await User.findById(session.user.id)
      .populate("watchlist", "title slug poster rating genres releaseYear quality")
      .populate("favorites", "title slug poster rating genres releaseYear quality");

    return NextResponse.json({ success: true, watchlist: user?.watchlist, favorites: user?.favorites });
  } catch {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const { movieId, type } = await req.json();
    const field = type === "favorite" ? "favorites" : "watchlist";

    const user = await User.findById(session.user.id);
    if (!user) return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });

    const list = user[field] as typeof user.watchlist;
    const index = list.findIndex((id) => id.toString() === movieId);

    if (index > -1) {
      list.splice(index, 1);
    } else {
      list.push(movieId);
    }

    await user.save();
    return NextResponse.json({ success: true, added: index === -1 });
  } catch {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
