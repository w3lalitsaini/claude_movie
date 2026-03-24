"use client";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FiHome, FiFilm, FiUsers, FiMessageSquare, FiFileText,
  FiGrid, FiImage, FiSettings, FiMenu, FiX, FiLogOut,
  FiTrendingUp, FiBarChart2, FiTag, FiMail, FiZap
} from "react-icons/fi";
import { signOut } from "next-auth/react";
import AdminHeader from "./components/AdminHeader";

const navItems = [
  { href: "/admin", icon: FiHome, label: "Dashboard", exact: true },
  { href: "/admin/agent", icon: FiTrendingUp, label: "AI Command Center" },
  { href: "/admin/movies", icon: FiFilm, label: "Movies" },
  { href: "/admin/categories", icon: FiGrid, label: "Categories" },
  { href: "/admin/blog", icon: FiFileText, label: "Blog Posts" },
  { href: "/admin/users", icon: FiUsers, label: "Users" },
  { href: "/admin/reviews", icon: FiMessageSquare, label: "Reviews" },
  { href: "/admin/media", icon: FiImage, label: "Media" },
  { href: "/admin/analytics", icon: FiBarChart2, label: "Analytics" },
  { href: "/admin/newsletter", icon: FiMail, label: "Newsletter" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user?.role !== "admin") {
      router.replace("/auth/login");
    }
  }, [session, status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#060606] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-[#e50914] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session || session.user?.role !== "admin") return null;

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <div className="min-h-screen bg-[#060606] flex font-sans selection:bg-yellow-500/30">
      <AdminHeader />
      
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 bottom-0 z-60 bg-[#0a0a0a]/80 backdrop-blur-xl border-r border-[#1a1a1a] flex flex-col transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-20"
        }`}
      >
        {/* Logo/Header in Sidebar */}
        <div className="h-20 flex items-center px-6 border-b border-[#1a1a1a] gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-500 hover:text-white transition-colors"
          >
            {sidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
          {sidebarOpen && (
            <Link href="/admin" className="font-display font-black text-xl tracking-tighter text-white uppercase text-[15px]">
              MASTER <span className="text-yellow-500">HQ</span>
            </Link>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-8 px-3 space-y-1.5 custom-scrollbar">
          {navItems.map(({ href, icon: Icon, label, exact }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all group ${
                isActive(href, exact)
                  ? "bg-yellow-500 text-black shadow-[0_0_20px_rgba(234,179,8,0.3)]"
                  : "text-gray-500 hover:text-white hover:bg-white/5"
              }`}
              title={!sidebarOpen ? label : undefined}
            >
              <Icon size={18} className={`shrink-0 transition-transform group-hover:scale-110 ${isActive(href, exact) ? "text-black" : "text-yellow-500"}`} />
              {sidebarOpen && <span className="uppercase tracking-tighter text-[11px]">{label}</span>}
            </Link>
          ))}
        </nav>

        {/* Bottom */}
        <div className="p-4 border-t border-[#1a1a1a] space-y-2">
          <Link
            href="/"
            className="flex items-center gap-4 px-4 py-3 text-[10px] font-bold text-gray-500 hover:text-white rounded-2xl hover:bg-white/5 transition-all uppercase tracking-tighter"
          >
            <FiHome size={16} />
            {sidebarOpen && "Front Office"}
          </Link>
          <button
            onClick={() => signOut()}
            className="w-full flex items-center gap-4 px-4 py-3 text-[10px] font-bold text-red-500/70 hover:text-red-500 rounded-2xl hover:bg-red-500/5 transition-all uppercase tracking-tighter"
          >
            <FiLogOut size={16} />
            {sidebarOpen && "Kill Session"}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className={`flex-1 min-h-screen pt-20 transition-all duration-300 ${sidebarOpen ? "pl-64" : "pl-20"}`}>
        {/* Status Bar (Now smaller and integrated) */}
        <div className="h-10 bg-[#0a0a0a] border-b border-[#1a1a1a] flex items-center px-8 gap-8 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Network: Secure</span>
          </div>
          <div className="flex items-center gap-2 shrink-0 border-l border-[#1a1a1a] pl-8">
            <FiZap className="text-yellow-500 text-[10px]" />
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">AI: Llama-3 DeepSync</span>
          </div>
          <div className="flex items-center gap-2 shrink-0 border-l border-[#1a1a1a] pl-8">
            <FiTrendingUp className="text-blue-500 text-[10px]" />
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">DB: Upstash REST [Active]</span>
          </div>
        </div>

        <div className="p-8 md:p-5">{children}</div>
      </main>
    </div>
  );
}
