"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiEye,
  FiAlertCircle,
} from "react-icons/fi";
import toast from "react-hot-toast";

interface PostData {
  _id: string;
  title: string;
  slug: string;
  category: string;
  status: string;
  views: number;
  author: { name: string };
  createdAt: string;
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/blog?limit=100")
      .then((r) => r.json())
      .then((d) => setPosts(d.success && d.posts ? d.posts : []))
      .catch(() => toast.error("Failed to fetch blog posts"))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/blog/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setPosts((prev) => prev.filter((p) => p._id !== id));
        setDeleteModal(null);
        toast.success("Post deleted");
      } else {
        toast.error(data.error || "Delete failed");
      }
    } catch {
      toast.error("Delete failed");
    }
  };

  const toggleStatus = async (post: PostData) => {
    try {
      const newStatus = post.status === "published" ? "draft" : "published";
      const res = await fetch(`/api/blog/${post.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setPosts((prev) =>
          prev.map((p) => (p._id === post._id ? { ...p, status: newStatus } : p))
        );
        toast.success("Status updated");
      }
    } catch {
      toast.error("Update failed");
    }
  };

  if (loading) {
    return (
      <div className="p-0 flex justify-center items-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-[#e50914] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-0">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-bold text-2xl text-white uppercase tracking-widest">
            Blog Posts
          </h1>
          <p className="text-[#555] text-sm mt-0.5">
            {posts.length} total posts
          </p>
        </div>
        <Link
          href="/admin/blog/new"
          className="btn-red flex items-center gap-2 text-white font-bold px-4 py-2.5 rounded-sm text-sm"
        >
          <FiPlus size={14} /> New Post
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total Posts", val: posts.length, color: "text-white" },
          {
            label: "Published",
            val: posts.filter((p) => p.status === "published").length,
            color: "text-green-400",
          },
          {
            label: "Drafts",
            val: posts.filter((p) => p.status === "draft").length,
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

      <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-sm overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#1a1a1a]">
              {[
                "Title",
                "Category",
                "Author",
                "Views",
                "Status",
                "Date",
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
            {posts.map((p) => (
              <tr key={p._id} className="hover:bg-[#111] transition-colors">
                <td className="px-5 py-3.5">
                  <p className="text-white font-semibold text-sm line-clamp-1 max-w-xs">
                    {p.title}
                  </p>
                </td>
                <td className="px-5 py-3.5">
                  <span className="bg-[#1a1a1a] border border-[#2a2a2a] text-[#aaa] text-xs px-2 py-1 rounded-sm">
                    {p.category}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-[#888] text-sm">
                  {p.author?.name || "Admin"}
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-1 text-[#666] text-sm">
                    <FiEye size={12} /> {p.views.toLocaleString()}
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <button
                    onClick={() => toggleStatus(p)}
                    className={`text-xs font-semibold px-2 py-1 rounded-sm transition-colors ${p.status === "published" ? "bg-green-900/30 text-green-400 border border-green-700/40 hover:bg-green-900/50" : "bg-yellow-900/30 text-yellow-400 border border-yellow-700/40 hover:bg-yellow-900/50"}`}
                  >
                    {p.status}
                  </button>
                </td>
                <td className="px-5 py-3.5 text-[#555] text-xs">
                  {p.createdAt}
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-1.5">
                    <Link
                      href={`/blog/${p.slug}`}
                      target="_blank"
                      className="w-7 h-7 bg-[#1a1a1a] hover:bg-[#222] text-[#888] hover:text-white rounded-sm flex items-center justify-center transition-colors"
                    >
                      <FiEye size={12} />
                    </Link>
                    <Link
                      href={`/admin/blog/edit/${p.slug}`}
                      className="w-7 h-7 bg-[#1a4a8a]/30 hover:bg-[#1a4a8a]/60 text-blue-400 rounded-sm flex items-center justify-center transition-colors"
                    >
                      <FiEdit2 size={12} />
                    </Link>
                    <button
                      onClick={() => setDeleteModal(p._id)}
                      className="w-7 h-7 bg-[#e50914]/20 hover:bg-[#e50914]/40 text-[#e50914] rounded-sm flex items-center justify-center transition-colors"
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

      {deleteModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-[#111] border border-[#222] rounded-sm p-6 max-w-sm w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#e50914]/20 rounded-full flex items-center justify-center">
                <FiAlertCircle size={20} className="text-[#e50914]" />
              </div>
              <h3 className="text-white font-bold text-lg">Delete Post?</h3>
            </div>
            <p className="text-[#888] text-sm mb-5">
              This blog post will be permanently deleted.
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
