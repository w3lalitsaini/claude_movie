"use client";
import { useState, useEffect } from "react";
import {
  FiSearch,
  FiTrash2,
  FiAlertCircle,
  FiUserX,
  FiUserCheck,
  FiMail,
} from "react-icons/fi";
import toast from "react-hot-toast";

interface UserData {
  _id: string;
  name: string;
  email: string;
  role: string;
  isBanned: boolean;
  reviews: number;
  joinedAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteModal, setDeleteModal] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/users")
      .then((r) => r.json())
      .then((d) => setUsers(d.success && d.users ? d.users : []))
      .catch(() => toast.error("Failed to fetch users"))
      .finally(() => setLoading(false));
  }, []);

  const handleBan = async (userId: string, ban: boolean) => {
    try {
      // In a real app, you'd make an API call here:
      // await fetch(`/api/admin/users/${userId}/ban`, { method: "PUT", body: JSON.stringify({ isBanned: ban }) })
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, isBanned: ban } : u)),
      );
      toast.success(ban ? "User banned" : "User unbanned");
    } catch {
      toast.error("Action failed");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      // In a real app, you'd make an API call here:
      // await fetch(`/api/admin/users/${id}`, { method: "DELETE" })
      setUsers((prev) => prev.filter((u) => u._id !== id));
      setDeleteModal(null);
      toast.success("User deleted");
    } catch {
      toast.error("Action failed");
    }
  };

  const filtered = users.filter(
    (u) =>
      (u.name && u.name.toLowerCase().includes(search.toLowerCase())) ||
      (u.email && u.email.toLowerCase().includes(search.toLowerCase())),
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
            Users
          </h1>
          <p className="text-[#555] text-sm mt-0.5">
            {users.length} registered users
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total Users", val: users.length, color: "text-white" },
          {
            label: "Active Users",
            val: users.filter((u) => !u.isBanned).length,
            color: "text-green-400",
          },
          {
            label: "Banned Users",
            val: users.filter((u) => u.isBanned).length,
            color: "text-red-400",
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
            placeholder="Search users..."
            className="w-full bg-[#0a0a0a] border border-[#2a2a2a] focus:border-[#e50914] text-white text-sm pl-9 pr-4 py-2.5 rounded-sm outline-none transition-colors"
          />
        </div>
      </div>

      <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-sm overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#1a1a1a]">
              {["User", "Role", "Reviews", "Joined", "Status", "Actions"].map(
                (h) => (
                  <th
                    key={h}
                    className="px-5 py-3.5 text-left text-xs font-bold text-[#555] uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#111]">
            {filtered.map((u) => (
              <tr
                key={u._id}
                className={`hover:bg-[#111] transition-colors ${u.isBanned ? "opacity-60" : ""}`}
              >
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-[#e50914] rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {u.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">
                        {u.name}
                      </p>
                      <p className="text-[#555] text-xs flex items-center gap-1">
                        <FiMail size={10} /> {u.email}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <span
                    className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-sm ${u.role === "admin" ? "bg-[#e50914]/20 text-[#e50914] border border-[#e50914]/30" : "bg-[#1a1a1a] text-[#888] border border-[#2a2a2a]"}`}
                  >
                    {u.role}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-[#888] text-sm">{u.reviews}</td>
                <td className="px-5 py-3.5 text-[#555] text-xs">
                  {u.joinedAt}
                </td>
                <td className="px-5 py-3.5">
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-sm ${u.isBanned ? "bg-red-900/30 text-red-400 border border-red-700/40" : "bg-green-900/30 text-green-400 border border-green-700/40"}`}
                  >
                    {u.isBanned ? "Banned" : "Active"}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleBan(u._id, !u.isBanned)}
                      className={`w-7 h-7 rounded-sm flex items-center justify-center transition-colors ${u.isBanned ? "bg-green-900/30 hover:bg-green-900/60 text-green-400" : "bg-yellow-900/30 hover:bg-yellow-900/60 text-yellow-400"}`}
                      title={u.isBanned ? "Unban" : "Ban"}
                    >
                      {u.isBanned ? (
                        <FiUserCheck size={12} />
                      ) : (
                        <FiUserX size={12} />
                      )}
                    </button>
                    <button
                      onClick={() => setDeleteModal(u._id)}
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
              <h3 className="text-white font-bold text-lg">Delete User?</h3>
            </div>
            <p className="text-[#888] text-sm mb-5">
              This will permanently delete the user and all their data.
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
