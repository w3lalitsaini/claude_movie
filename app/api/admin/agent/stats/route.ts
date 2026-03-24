import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Movie from "@/models/Movie";
import AgentLog from "@/models/AgentLog";

export async function GET() {
  try {
    await connectDB();

    // 1. Calculate Revenue (Simulated logic: Sum of ratings * 10 or similar for demo)
    const movies = await Movie.find();
    const totalRevenue = movies.reduce((acc, m) => acc + (m.rating || 0) * 1.5, 0);

    // 2. Calculate AI Cost (Sum of agent logs metadata.cost if exists)
    const logs = await AgentLog.find();
    const totalCost = logs.length * 0.05; // $0.05 per agent cycle estimate

    // 3. CTR & Impressions (Simulated for dash)
    const stats = {
      revenueData: [
        { name: "Mon", revenue: totalRevenue * 0.1, cost: totalCost * 0.1 },
        { name: "Tue", revenue: totalRevenue * 0.15, cost: totalCost * 0.12 },
        { name: "Wed", revenue: totalRevenue * 0.25, cost: totalCost * 0.15 },
        { name: "Thu", revenue: totalRevenue * 0.45, cost: totalCost * 0.18 },
        { name: "Fri", revenue: totalRevenue * 0.65, cost: totalCost * 0.22 },
        { name: "Today", revenue: totalRevenue, cost: totalCost },
      ],
      totals: {
        revenue: totalRevenue.toFixed(2),
        cost: totalCost.toFixed(2),
        roi: totalCost > 0 ? (((totalRevenue - totalCost) / totalCost) * 100).toFixed(1) : "0"
      }
    };

    return NextResponse.json({ success: true, stats });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
