"use client";
import { useEffect, useState } from "react";
import { FiTrendingUp, FiEye, FiUsers, FiFilm, FiStar, FiArrowUp } from "react-icons/fi";
import toast from "react-hot-toast";

interface AnalyticsData {
  stats: { totalViews: number; activeUsers: number; moviesAdded: number; avgRating: number; };
  monthlyData: { month: string; views: number; users: number; }[];
  topMovies: { title: string; views: number; category: string; }[];
  categories: { label: string; pct: number; count: number; color: string; }[];
  recentActivity: { type: string; text: string; time: string; }[];
}

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/analytics")
      .then(r => r.json())
      .then(d => {
        if (d.success) setData(d);
        else toast.error(d.error || "Failed to fetch analytics");
      })
      .catch(() => toast.error("Network error fetching analytics"))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return (
      <div className="p-6 flex justify-center items-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-[#e50914] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const { stats, monthlyData, topMovies, categories, recentActivity } = data;
  const maxViews = Math.max(...monthlyData.map(d => d.views), 1); // fallback to 1 to avoid div by zero
  const maxTopMovieViews = Math.max(...topMovies.map(m => m.views), 1);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "k";
    return num.toString();
  };

  return (
    <div className="p-0">
      <div className="mb-6">
        <h1 className="font-display font-bold text-2xl text-white uppercase tracking-widest">Analytics</h1>
        <p className="text-[#555] text-sm mt-0.5">Platform performance overview</p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
        {[
          { label: "Total Views", val: formatNumber(stats.totalViews), icon: FiEye, change: 10, color: "text-blue-400" },
          { label: "Active Users", val: formatNumber(stats.activeUsers), icon: FiUsers, change: 5, color: "text-green-400" },
          { label: "Movies Added", val: formatNumber(stats.moviesAdded), icon: FiFilm, change: 12, color: "text-purple-400" },
          { label: "Avg Rating", val: stats.avgRating.toFixed(1), icon: FiStar, change: 2, color: "text-yellow-400" },
        ].map(({label,val,icon:Icon,change,color}) => (
          <div key={label} className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <Icon size={18} className={color}/>
              <span className="flex items-center gap-1 text-xs text-green-400 font-semibold">
                <FiArrowUp size={10}/> {change}%
              </span>
            </div>
            <p className="text-2xl font-display font-bold text-white">{val}</p>
            <p className="text-[#555] text-xs uppercase tracking-wider mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Monthly Views Chart */}
        <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-sm p-5">
          <h2 className="font-display font-bold text-sm uppercase tracking-widest text-white mb-5 flex items-center gap-2">
            <span className="w-1 h-4 bg-[#e50914] inline-block rounded-sm"/> Monthly Traffic
          </h2>
          <div className="flex items-end gap-3 h-40">
            {monthlyData.map(d => (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-1.5">
                <span className="text-[#555] text-xs">{formatNumber(d.views)}</span>
                <div
                  className="w-full bg-gradient-to-t from-[#e50914] to-[#e50914]/50 rounded-sm transition-all hover:from-[#ff1e2d] hover:to-[#ff1e2d]/50"
                  style={{ height: `${(d.views/maxViews)*100}%`, minHeight: "8px" }}
                  title={`${d.views.toLocaleString()} views`}
                />
                <span className="text-[#555] text-xs">{d.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Movies */}
        <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-sm p-5">
          <h2 className="font-display font-bold text-sm uppercase tracking-widest text-white mb-5 flex items-center gap-2">
            <span className="w-1 h-4 bg-[#e50914] inline-block rounded-sm"/> Top Movies by Views
          </h2>
          <div className="space-y-3">
            {topMovies.map((m,i) => (
              <div key={m.title} className="flex items-center gap-3">
                <span className="text-[#555] text-xs font-bold w-4 flex-shrink-0">#{i+1}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white text-sm font-semibold truncate pr-2">{m.title}</span>
                    <span className="text-[#888] text-xs">{m.views.toLocaleString()}</span>
                  </div>
                  <div className="h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#e50914] to-[#e50914]/60 rounded-full"
                      style={{ width: `${(m.views/maxTopMovieViews)*100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
            {topMovies.length === 0 && <p className="text-[#555] text-sm py-4">No movie data found</p>}
          </div>
        </div>

        {/* Category breakdown */}
        <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-sm p-5">
          <h2 className="font-display font-bold text-sm uppercase tracking-widest text-white mb-5 flex items-center gap-2">
            <span className="w-1 h-4 bg-[#e50914] inline-block rounded-sm"/> Content by Category
          </h2>
          <div className="space-y-4">
            {categories.map(c => (
              <div key={c.label}>
                <div className="flex justify-between mb-1">
                  <span className="text-[#aaa] text-sm capitalize">{c.label}</span>
                  <span className="text-[#666] text-xs">{c.count} ({c.pct}%)</span>
                </div>
                <div className="h-2 bg-[#1a1a1a] rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${c.pct}%`, backgroundColor: c.color }} />
                </div>
              </div>
            ))}
            {categories.length === 0 && <p className="text-[#555] text-sm py-4">No categories found</p>}
          </div>
        </div>

        {/* Recent activity */}
        <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-sm p-5">
          <h2 className="font-display font-bold text-sm uppercase tracking-widest text-white mb-5 flex items-center gap-2">
            <span className="w-1 h-4 bg-[#e50914] inline-block rounded-sm"/> Recent Activity
          </h2>
          <div className="space-y-3">
            {recentActivity.map((a, i) => (
              <div key={i} className="flex items-start gap-3 py-2 border-b border-[#111] last:border-0 border-opacity-50">
                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                  a.type === "movie" ? "bg-[#e50914]" : a.type === "user" ? "bg-blue-500" : a.type === "review" ? "bg-yellow-500" : "bg-purple-500"
                }`}/>
                <div className="flex-1">
                  <p className="text-[#aaa] text-sm">{a.text}</p>
                  <p className="text-[#444] text-xs mt-0.5">{a.time}</p>
                </div>
              </div>
            ))}
            {recentActivity.length === 0 && <p className="text-[#555] text-sm py-4">No recent activity</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
