"use client";
import { useState, useEffect } from "react";
import {
  FiSearch,
  FiTrash2,
  FiCheck,
  FiX,
  FiStar,
  FiAlertCircle,
} from "react-icons/fi";
import toast from "react-hot-toast";

interface ReviewData {
  _id: string;
  user: { name: string; email?: string; avatar?: string };
  movie?: { title: string; slug?: string };
  rating: number;
  title: string;
  content: string;
  isApproved: boolean;
  createdAt: string;
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteModal, setDeleteModal] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/reviews")
      .then((r) => r.json())
      .then((d) => setReviews(d.success && d.reviews ? d.reviews : []))
      .catch(() => toast.error("Failed to fetch reviews"))
      .finally(() => setLoading(false));
  }, []);

  const handleApprove = async (id: string, approve: boolean) => {
    try {
      // await fetch(`/api/admin/reviews/${id}/approve`, { method: "PUT", body: JSON.stringify({ isApproved: approve }) })
      setReviews((prev) =>
        prev.map((r) => (r._id === id ? { ...r, isApproved: approve } : r)),
      );
      toast.success(approve ? "Review approved" : "Review hidden");
    } catch {
      toast.error("Action failed");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      // await fetch(`/api/admin/reviews/${id}`, { method: "DELETE" })
      setReviews((prev) => prev.filter((r) => r._id !== id));
      setDeleteModal(null);
      toast.success("Review deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  const filtered = reviews.filter(
    (r) =>
      (r.user?.name &&
        r.user.name.toLowerCase().includes(search.toLowerCase())) ||
      (r.movie?.title &&
        r.movie.title.toLowerCase().includes(search.toLowerCase())),
  );

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-[#e50914] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-0">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-bold text-2xl text-white uppercase tracking-widest">
            Reviews
          </h1>
          <p className="text-[#555] text-sm mt-0.5">
            {reviews.length} total reviews
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total Reviews", val: reviews.length, color: "text-white" },
          {
            label: "Approved",
            val: reviews.filter((r) => r.isApproved).length,
            color: "text-green-400",
          },
          {
            label: "Pending",
            val: reviews.filter((r) => !r.isApproved).length,
            color: "text-yellow-400",
          },
        ].map(({ label, val, color }) => (
          <div
            key={label}
            className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-sm p-4"
          >
            <p className={`text-2xl font-display font-bold ${color}`}>{val}</p>
            <p className="text-[#555] text-xs uppercase tracking-wider">
              {label}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-sm p-4 mb-5">
        <div className="relative max-w-md">
          <FiSearch
            size={14}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#555]"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search reviews..."
            className="w-full bg-[#0a0a0a] border border-[#2a2a2a] focus:border-[#e50914] text-white text-sm pl-9 pr-4 py-2.5 rounded-sm outline-none transition-colors"
          />
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((r) => (
          <div
            key={r._id}
            className={`bg-[#0d0d0d] border rounded-sm p-4 ${r.isApproved ? "border-[#1a1a1a]" : "border-yellow-700/30"}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-[#e50914] rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                    {r.user.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">
                      {r.user.name}
                    </p>
                    <p className="text-[#555] text-xs">
                      on <span className="text-[#888]">{r.movie?.title}</span> ·{" "}
                      {r.createdAt}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 bg-[#e50914] text-white text-xs font-bold px-2 py-0.5 rounded-sm ml-auto">
                    <FiStar size={9} fill="currentColor" /> {r.rating}/10
                  </div>
                </div>
                <h4 className="text-white font-semibold text-sm mb-1">
                  {r.title}
                </h4>
                <p className="text-[#777] text-sm leading-relaxed line-clamp-2">
                  {r.content}
                </p>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button
                  onClick={() => handleApprove(r._id, !r.isApproved)}
                  className={`w-7 h-7 rounded-sm flex items-center justify-center transition-colors ${r.isApproved ? "bg-yellow-900/30 hover:bg-yellow-900/60 text-yellow-400" : "bg-green-900/30 hover:bg-green-900/60 text-green-400"}`}
                  title={r.isApproved ? "Hide" : "Approve"}
                >
                  {r.isApproved ? <FiX size={12} /> : <FiCheck size={12} />}
                </button>
                <button
                  onClick={() => setDeleteModal(r._id)}
                  className="w-7 h-7 bg-[#e50914]/20 hover:bg-[#e50914]/40 text-[#e50914] rounded-sm flex items-center justify-center transition-colors"
                >
                  <FiTrash2 size={12} />
                </button>
              </div>
            </div>
            {!r.isApproved && (
              <div className="mt-2 text-yellow-500 text-xs font-semibold">
                ⚠ Pending approval
              </div>
            )}
          </div>
        ))}
      </div>

      {deleteModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-[#111] border border-[#222] rounded-sm p-6 max-w-sm w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#e50914]/20 rounded-full flex items-center justify-center">
                <FiAlertCircle size={20} className="text-[#e50914]" />
              </div>
              <h3 className="text-white font-bold text-lg">Delete Review?</h3>
            </div>
            <p className="text-[#888] text-sm mb-5">
              This review will be permanently deleted.
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
                className="bg-[#1a1a1a] border border-[#333] text-[#ccc] font-bold px-5 py-2 rounded-sm text-sm flex-1"
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
