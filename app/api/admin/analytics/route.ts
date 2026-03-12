import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Movie from "@/models/Movie";
import User from "@/models/User";
import Review from "@/models/Review";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // Aggregations and Counts
    const totalUsers = await User.countDocuments();
    const totalMovies = await Movie.countDocuments();
    const totalReviews = await Review.countDocuments();

    // Get Total Views across all movies
    const viewsAggregation = await Movie.aggregate([
      { $group: { _id: null, totalViews: { $sum: "$views" } } }
    ]);
    const totalViews = viewsAggregation[0]?.totalViews || 0;

    // Get Average Rating across all reviews
    const ratingAggregation = await Review.aggregate([
      { $group: { _id: null, avgRating: { $avg: "$rating" } } }
    ]);
    const avgRating = ratingAggregation[0]?.avgRating ? Math.round(ratingAggregation[0].avgRating * 10) / 10 : 0;

    // Top Movies by Views
    const topMovies = await Movie.find()
      .sort({ views: -1 })
      .limit(5)
      .select("title views category");

    // Monthly Views (Mocked for now as we don't track views by date in the DB, but using relative recent months)
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const d = new Date();
    const monthlyData = Array.from({ length: 6 }).map((_, i) => {
      const monthIndex = (d.getMonth() - 5 + i + 12) % 12;
      return {
        month: monthNames[monthIndex],
        views: Math.floor(totalViews / 6) + Math.floor(Math.random() * 10000), // distributing views pseudo-randomly for visual
        users: Math.floor(totalUsers / 6) + Math.floor(Math.random() * 100),
      };
    });

    // Content by Category Breakdown
    const categoryAggregation = await Movie.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } }
    ]);
    const categories = categoryAggregation.map(c => ({
      label: c._id.replace("-", " "),
      count: c.count,
      pct: totalMovies > 0 ? Math.round((c.count / totalMovies) * 100) : 0,
      color: c._id === "bollywood" ? "#e50914" : c._id === "hollywood" ? "#1a4a8a" : c._id === "south-hindi" ? "#7b2d8b" : c._id === "dual-audio" ? "#1a6b3a" : "#8a4a1a"
    })).sort((a,b) => b.count - a.count);

    // Recent Activity mapping
    const recentMovies = await Movie.find().sort({ createdAt: -1 }).limit(2).select("title createdAt");
    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(2).select("name createdAt");
    const recentReviews = await Review.find().sort({ createdAt: -1 }).limit(2).populate("movie", "title").select("rating createdAt movie");

    const activity = [
      ...recentMovies.map(m => ({ type: "movie", text: `New movie added: ${m.title}`, time: m.createdAt })),
      ...recentUsers.map(u => ({ type: "user", text: `New user registered: ${u.name}`, time: u.createdAt })),
      ...recentReviews.map(r => ({ type: "review", text: `New review on: ${(r.movie as any)?.title || "Unknown"} (${r.rating}/10)`, time: r.createdAt }))
    ].sort((a: any, b: any) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 6);

    // Format time difference
    const formattedActivity = activity.map(a => {
      const diffMs = new Date().getTime() - new Date(a.time).getTime();
      const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffHrs / 24);
      let timeStr = "";
      if (diffDays > 0) timeStr = `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
      else if (diffHrs > 0) timeStr = `${diffHrs} hour${diffHrs > 1 ? 's' : ''} ago`;
      else timeStr = "Just now";

      return {
        type: a.type,
        text: a.text,
        time: timeStr
      };
    });

    return NextResponse.json({
      success: true,
      stats: {
        totalViews,
        activeUsers: totalUsers,
        moviesAdded: totalMovies,
        avgRating,
      },
      monthlyData,
      topMovies,
      categories,
      recentActivity: formattedActivity
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
