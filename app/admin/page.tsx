"use client";
import { useEffect, useState } from "react";
import {
  FiFilm,
  FiUsers,
  FiMessageSquare,
  FiFileText,
  FiTrendingUp,
  FiEye,
  FiPlus,
  FiArrowUp,
  FiArrowDown,
} from "react-icons/fi";
import Link from "next/link";

interface Stats {
  movies: number;
  users: number;
  reviews: number;
  blogs: number;
}

const DEMO_STATS: Stats = {
  movies: 1247,
  users: 8432,
  reviews: 24891,
  blogs: 156,
};

const RECENT_MOVIES = [
  {
    title: "Animal",
    category: "Bollywood",
    date: "2024-01-15",
    views: 12400,
    rating: 7.9,
  },
  {
    title: "Dunki",
    category: "Bollywood",
    date: "2024-01-14",
    views: 9800,
    rating: 7.2,
  },
  {
    title: "Salaar",
    category: "South Hindi",
    date: "2024-01-13",
    views: 15600,
    rating: 7.8,
  },
  {
    title: "Fighter",
    category: "Bollywood",
    date: "2024-01-12",
    views: 7200,
    rating: 7.3,
  },
  {
    title: "Aquaman 2",
    category: "Hollywood",
    date: "2024-01-11",
    views: 8900,
    rating: 6.5,
  },
];

const RECENT_USERS = [
  {
    name: "Arjun Sharma",
    email: "arjun@gmail.com",
    joined: "2024-01-15",
    reviews: 12,
  },
  {
    name: "Priya Patel",
    email: "priya@gmail.com",
    joined: "2024-01-14",
    reviews: 8,
  },
  {
    name: "Rohit Kumar",
    email: "rohit@gmail.com",
    joined: "2024-01-13",
    reviews: 24,
  },
  {
    name: "Sneha Singh",
    email: "sneha@gmail.com",
    joined: "2024-01-12",
    reviews: 5,
  },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>(DEMO_STATS);
  const [recentMovies, setRecentMovies] = useState(RECENT_MOVIES);
  const [recentUsers, setRecentUsers] = useState(RECENT_USERS);

  useEffect(() => {
    fetch("/api/admin/dashboard")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setStats(data.stats);
          if (data.recentMovies) setRecentMovies(data.recentMovies);
          if (data.recentUsers) setRecentUsers(data.recentUsers);
        }
      })
      .catch(console.error);
  }, []);

  const statCards = [
    {
      label: "Total Movies",
      value: stats.movies.toLocaleString(),
      icon: FiFilm,
      href: "/admin/movies",
      change: +12,
      bg: "from-red-900/30 to-red-950/50",
      border: "border-red-900/30",
    },
    {
      label: "Total Users",
      value: stats.users.toLocaleString(),
      icon: FiUsers,
      href: "/admin/users",
      change: +24,
      bg: "from-blue-900/30 to-blue-950/50",
      border: "border-blue-900/30",
    },
    {
      label: "Total Reviews",
      value: stats.reviews.toLocaleString(),
      icon: FiMessageSquare,
      href: "/admin/reviews",
      change: +8,
      bg: "from-green-900/30 to-green-950/50",
      border: "border-green-900/30",
    },
    {
      label: "Blog Posts",
      value: stats.blogs.toLocaleString(),
      icon: FiFileText,
      href: "/admin/blog",
      change: +3,
      bg: "from-purple-900/30 to-purple-950/50",
      border: "border-purple-900/30",
    },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="font-display font-bold text-2xl text-white uppercase tracking-widest">
            Dashboard
          </h1>
          <p className="text-[#555] text-sm mt-0.5">
            Welcome back, Administrator
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/admin/movies/new"
            className="btn-red flex items-center gap-2 text-white font-bold px-4 py-2.5 rounded-sm text-sm"
          >
            <FiPlus size={14} /> Add Movie
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
        {statCards.map(
          ({ label, value, icon: Icon, href, change, bg, border }) => (
            <Link
              key={label}
              href={href}
              className={`bg-gradient-to-br ${bg} border ${border} rounded-sm p-5 hover:border-opacity-60 transition-all group`}
            >
              <div className="flex items-start justify-between mb-4">
                <Icon
                  size={22}
                  className="text-white opacity-60 group-hover:opacity-100 transition-opacity"
                />
                <div
                  className={`flex items-center gap-1 text-xs font-semibold ${change >= 0 ? "text-green-400" : "text-red-400"}`}
                >
                  {change >= 0 ? (
                    <FiArrowUp size={11} />
                  ) : (
                    <FiArrowDown size={11} />
                  )}
                  {Math.abs(change)}%
                </div>
              </div>
              <p className="text-3xl font-display font-bold text-white">
                {value}
              </p>
              <p className="text-[#777] text-xs uppercase tracking-widest mt-1">
                {label}
              </p>
            </Link>
          ),
        )}
      </div>

      {/* Content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Recent Movies */}
        <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-sm">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#1a1a1a]">
            <h2 className="font-display font-bold text-sm uppercase tracking-widest text-white flex items-center gap-2">
              <span className="w-1 h-4 bg-[#e50914] inline-block rounded-sm" />{" "}
              Recent Movies
            </h2>
            <Link
              href="/admin/movies"
              className="text-xs text-[#e50914] hover:text-[#ff1e2d] transition-colors font-semibold"
            >
              View All
            </Link>
          </div>
          <div className="divide-y divide-[#1a1a1a]">
            {recentMovies.map((m) => (
              <div
                key={m.title}
                className="flex items-center justify-between px-5 py-3 hover:bg-[#111] transition-colors"
              >
                <div>
                  <p className="text-white text-sm font-semibold">{m.title}</p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-[#555] text-xs">{m.category}</span>
                    <span className="text-[#444] text-xs">{m.date}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-[#fbbf24] text-xs font-semibold justify-end">
                    ★ {m.rating}
                  </div>
                  <div className="flex items-center gap-1 text-[#555] text-xs">
                    <FiEye size={10} /> {m.views.toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Users */}
        <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-sm">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#1a1a1a]">
            <h2 className="font-display font-bold text-sm uppercase tracking-widest text-white flex items-center gap-2">
              <span className="w-1 h-4 bg-[#e50914] inline-block rounded-sm" />{" "}
              New Users
            </h2>
            <Link
              href="/admin/users"
              className="text-xs text-[#e50914] hover:text-[#ff1e2d] transition-colors font-semibold"
            >
              View All
            </Link>
          </div>
          <div className="divide-y divide-[#1a1a1a]">
            {recentUsers.map((u) => (
              <div
                key={u.email}
                className="flex items-center gap-4 px-5 py-3 hover:bg-[#111] transition-colors"
              >
                <div className="w-9 h-9 bg-[#e50914] rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {u.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-semibold truncate">
                    {u.name}
                  </p>
                  <p className="text-[#555] text-xs truncate">{u.email}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-[#aaa] text-xs">{u.reviews} reviews</p>
                  <p className="text-[#444] text-xs">{u.joined}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="mt-5 bg-[#0d0d0d] border border-[#1a1a1a] rounded-sm p-5">
        <h2 className="font-display font-bold text-sm uppercase tracking-widest text-white mb-4 flex items-center gap-2">
          <span className="w-1 h-4 bg-[#e50914] inline-block rounded-sm" />{" "}
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Add Movie", href: "/admin/movies/new", icon: FiFilm },
            {
              label: "New Blog Post",
              href: "/admin/blog/new",
              icon: FiFileText,
            },
            {
              label: "Manage Reviews",
              href: "/admin/reviews",
              icon: FiMessageSquare,
            },
            {
              label: "View Analytics",
              href: "/admin/analytics",
              icon: FiTrendingUp,
            },
          ].map(({ label, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center gap-2 bg-[#111] border border-[#222] hover:border-[#e50914]/40 hover:bg-[#e50914]/5 rounded-sm p-4 transition-all group text-center"
            >
              <Icon
                size={22}
                className="text-[#555] group-hover:text-[#e50914] transition-colors"
              />
              <span className="text-[#888] group-hover:text-white text-xs font-semibold transition-colors">
                {label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
