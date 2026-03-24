import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { Redis } from "ioredis";

export async function GET() {
  const health: any = {
    mongodb: "checking",
    redis: "checking",
    tmdb: "checking",
    latency: {}
  };

  try {
    // 1. Check MongoDB
    if (mongoose.connection.readyState === 1) {
      health.mongodb = "🟢 Connected";
    } else {
      health.mongodb = "🔴 Disconnected";
    }

    // 2. Check Redis
    const startRedis = Date.now();
    const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");
    await redis.ping();
    health.redis = "🟢 Active";
    health.latency.redis = `${Date.now() - startRedis}ms`;
    await redis.quit();

    // 3. Check TMDB (Simple fetch)
    const startTmdb = Date.now();
    const tmdbRes = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${process.env.TMDB_API_KEY}`);
    if (tmdbRes.ok) {
      health.tmdb = "🟢 Healthy";
      health.latency.tmdb = `${Date.now() - startTmdb}ms`;
    } else {
      health.tmdb = "🟡 Slow/Limited";
    }

    return NextResponse.json({ success: true, health });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
