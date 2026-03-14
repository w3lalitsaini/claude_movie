"use client";
import { useEffect, useState } from "react";
import { FiMail, FiUsers, FiCalendar, FiDownload } from "react-icons/fi";
import toast from "react-hot-toast";

export default function AdminNewsletterPage() {
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      const res = await fetch("/api/admin/newsletter");
      const data = await res.json();
      if (data.success) {
        setSubscribers(data.subscribers);
      }
    } catch {
      toast.error("Failed to load subscribers");
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    if (subscribers.length === 0) return;
    
    // Create CSV content
    const headers = ["Email", "Subscribed Date"];
    const rows = subscribers.map(sub => [
      sub.email,
      new Date(sub.createdAt).toLocaleDateString()
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n"
      + rows.map(e => e.join(",")).join("\n");
      
    // Trigger download
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `atoz-subscribers-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center min-h-[50vh]">
        <div className="w-8 h-8 border-2 border-[#e50914] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Newsletter Subscribers</h1>
          <p className="text-[#888] text-sm">Manage your email marketing audience</p>
        </div>
        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white border border-[#333] px-4 py-2 rounded-sm text-sm font-semibold transition-colors"
        >
          <FiDownload size={14} /> Export CSV
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#111] border border-[#1a1a1a] p-6 rounded-sm">
          <div className="w-10 h-10 bg-[#e50914]/10 rounded-sm flex items-center justify-center text-[#e50914] mb-4">
            <FiUsers size={20} />
          </div>
          <h3 className="text-[#888] text-sm font-semibold uppercase tracking-wider mb-1">
            Total Subscribers
          </h3>
          <p className="text-3xl font-bold text-white">{subscribers.length}</p>
        </div>
        
        <div className="bg-[#111] border border-[#1a1a1a] p-6 rounded-sm">
          <div className="w-10 h-10 bg-[#e50914]/10 rounded-sm flex items-center justify-center text-[#e50914] mb-4">
            <FiCalendar size={20} />
          </div>
          <h3 className="text-[#888] text-sm font-semibold uppercase tracking-wider mb-1">
            Recent (Last 30 Days)
          </h3>
          <p className="text-3xl font-bold text-white">
            {subscribers.filter(s => new Date(s.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#111] border border-[#1a1a1a] rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#1a1a1a] text-[#888] text-xs uppercase tracking-wider font-semibold border-b border-[#222]">
              <tr>
                <th className="px-6 py-4">Email Address</th>
                <th className="px-6 py-4">Subscribed Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a1a1a]">
              {subscribers.length > 0 ? (
                subscribers.map((sub) => (
                  <tr key={sub._id} className="hover:bg-[#151515] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#1a1a1a] flex items-center justify-center text-[#888]">
                          <FiMail size={14} />
                        </div>
                        <span className="text-white text-sm">{sub.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[#888] text-sm">
                      {new Date(sub.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={2} className="px-6 py-8 text-center text-[#666] text-sm">
                    No subscribers found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
