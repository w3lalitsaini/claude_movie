"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiSearch,
  FiEye,
  FiStar,
  FiAlertCircle,
} from "react-icons/fi";
import toast from "react-hot-toast";

interface MovieData {
  _id: string;
  title: string;
  slug: string;
  poster: string;
  category: string;
  rating: number;
  releaseYear: number;
  views: number;
  isTrending: boolean;
  status: string;
}

export default function AdminMoviesPage() {
  const [movies, setMovies] = useState<MovieData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteModal, setDeleteModal] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/movies?limit=0") // limit=0 to theoretically fetch all for admin, or a very high limit
      .then((r) => r.json())
      .then((d) => setMovies(d.success && d.movies ? d.movies : []))
      .catch(() => toast.error("Failed to fetch movies"))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (slug: string) => {
    try {
      const res = await fetch(`/api/movies/${slug}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setMovies((prev) => prev.filter((m) => m.slug !== slug));
        toast.success("Movie deleted");
      } else toast.error("Delete failed");
    } catch {
      toast.error("Something went wrong");
    }
    setDeleteModal(null);
  };

  const filtered = movies.filter((m) =>
    m.title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="p-0">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-bold text-2xl text-white uppercase tracking-widest">
            Movies
          </h1>
          <p className="text-[#555] text-sm mt-0.5">
            {movies.length} total movies
          </p>
        </div>
        <Link
          href="/admin/movies/new"
          className="btn-red flex items-center gap-2 text-white font-bold px-4 py-2.5 rounded-sm text-sm"
        >
          <FiPlus size={14} /> Add Movie
        </Link>
      </div>

      {/* Search */}
      <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-sm p-4 mb-5">
        <div className="relative max-w-md">
          <FiSearch
            size={14}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#555]"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search movies..."
            className="w-full bg-[#0a0a0a] border border-[#2a2a2a] focus:border-[#e50914] text-white text-sm pl-9 pr-4 py-2.5 rounded-sm outline-none transition-colors"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1a1a1a]">
                {[
                  "Movie",
                  "Category",
                  "Rating",
                  "Year",
                  "Views",
                  "Status",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3.5 text-left text-xs font-bold text-[#555] uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#111]">
              {loading
                ? Array.from({ length: 5 }, (_, i) => (
                    <tr key={i}>
                      {Array.from({ length: 7 }, (_, j) => (
                        <td key={j} className="px-5 py-3.5">
                          <div className="h-4 skeleton rounded w-full max-w-24" />
                        </td>
                      ))}
                    </tr>
                  ))
                : filtered.map((m) => (
                    <tr
                      key={m._id}
                      className="hover:bg-[#111] transition-colors"
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-14 flex-shrink-0 rounded-sm overflow-hidden bg-[#1a1a1a]">
                            {m.poster && (
                              <Image
                                src={m.poster}
                                alt={m.title}
                                fill
                                className="object-cover"
                              />
                            )}
                          </div>
                          <div>
                            <p className="text-white font-semibold text-sm">
                              {m.title}
                            </p>
                            {m.isTrending && (
                              <span className="text-[#e50914] text-xs font-semibold">
                                ● Trending
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="bg-[#1a1a1a] border border-[#2a2a2a] text-[#aaa] text-xs px-2 py-1 rounded-sm capitalize">
                          {m.category?.replace("-", " ")}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1 text-[#fbbf24] text-sm font-semibold">
                          <FiStar size={11} fill="currentColor" />
                          {m.rating}
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-[#888] text-sm">
                        {m.releaseYear}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1 text-[#666] text-sm">
                          <FiEye size={12} />
                          {m.views?.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="bg-green-900/30 border border-green-700/40 text-green-400 text-xs px-2 py-1 rounded-sm">
                          {m.status || "active"}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <Link
                            href={`/movies/${m.slug}`}
                            target="_blank"
                            className="w-7 h-7 bg-[#1a1a1a] hover:bg-[#222] text-[#888] hover:text-white rounded-sm flex items-center justify-center transition-colors"
                            title="View"
                          >
                            <FiEye size={12} />
                          </Link>
                          <Link
                            href={`/admin/movies/edit/${m.slug}`}
                            className="w-7 h-7 bg-[#1a4a8a]/30 hover:bg-[#1a4a8a]/60 text-blue-400 rounded-sm flex items-center justify-center transition-colors"
                            title="Edit"
                          >
                            <FiEdit2 size={12} />
                          </Link>
                          <button
                            onClick={() => setDeleteModal(m.slug)}
                            className="w-7 h-7 bg-[#e50914]/20 hover:bg-[#e50914]/40 text-[#e50914] rounded-sm flex items-center justify-center transition-colors"
                            title="Delete"
                          >
                            <FiTrash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Modal */}
      {deleteModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-[#111] border border-[#222] rounded-sm p-6 max-w-sm w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#e50914]/20 rounded-full flex items-center justify-center">
                <FiAlertCircle size={20} className="text-[#e50914]" />
              </div>
              <h3 className="text-white font-bold text-lg">Delete Movie?</h3>
            </div>
            <p className="text-[#888] text-sm mb-5">
              This action cannot be undone. The movie and all related data will
              be permanently deleted.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleDelete(deleteModal)}
                className="btn-red text-white font-bold px-5 py-2 rounded-sm text-sm flex-1"
              >
                Delete
              </button>
              <button
                onClick={() => setDeleteModal(null)}
                className="bg-[#1a1a1a] border border-[#333] text-[#ccc] font-bold px-5 py-2 rounded-sm text-sm flex-1 hover:border-[#444] transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
