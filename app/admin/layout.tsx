"use client";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FiHome, FiFilm, FiUsers, FiMessageSquare, FiFileText,
  FiGrid, FiImage, FiSettings, FiMenu, FiX, FiLogOut,
  FiTrendingUp, FiBarChart2, FiTag,
} from "react-icons/fi";
import { signOut } from "next-auth/react";

const navItems = [
  { href: "/admin", icon: FiHome, label: "Dashboard", exact: true },
  { href: "/admin/movies", icon: FiFilm, label: "Movies" },
  { href: "/admin/categories", icon: FiGrid, label: "Categories" },
  { href: "/admin/blog", icon: FiFileText, label: "Blog Posts" },
  { href: "/admin/users", icon: FiUsers, label: "Users" },
  { href: "/admin/reviews", icon: FiMessageSquare, label: "Reviews" },
  { href: "/admin/media", icon: FiImage, label: "Media" },
  { href: "/admin/analytics", icon: FiBarChart2, label: "Analytics" },
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
    <div className="min-h-screen bg-[#060606] flex">
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-28 bottom-0 z-40 bg-[#0a0a0a] border-r border-[#1a1a1a] flex flex-col transition-all duration-300 ${
          sidebarOpen ? "w-56" : "w-14"
        }`}
      >
        {/* Logo */}
        <div className="h-14 flex items-center px-4 border-b border-[#1a1a1a] gap-3">
          {sidebarOpen && (
            <Link href="/admin" className="flex items-center gap-0 font-display font-bold text-lg tracking-wider">
              <span className="text-white uppercase">CINE</span>
              <span className="bg-[#e50914] text-white px-1.5 py-0.5 uppercase text-sm">VERSE</span>
            </Link>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="ml-auto text-[#666] hover:text-white transition-colors p-1"
          >
            {sidebarOpen ? <FiX size={18} /> : <FiMenu size={18} />}
          </button>
        </div>

        {/* Admin badge */}
        {sidebarOpen && (
          <div className="mx-3 my-3 bg-[#e50914]/10 border border-[#e50914]/20 rounded-sm px-3 py-2">
            <p className="text-[#e50914] text-xs font-bold uppercase tracking-widest">Admin Panel</p>
            <p className="text-[#666] text-xs truncate">{session.user?.name}</p>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-2">
          {navItems.map(({ href, icon: Icon, label, exact }) => (
            <Link
              key={href}
              href={href}
              className={`admin-nav-item flex items-center gap-3 px-4 py-2.5 text-sm font-semibold transition-all ${
                isActive(href, exact)
                  ? "bg-[#e50914]/15 border-l-[3px] border-[#e50914] text-white pl-[13px]"
                  : "text-[#666] hover:text-white border-l-[3px] border-transparent"
              }`}
              title={!sidebarOpen ? label : undefined}
            >
              <Icon size={16} className="flex-shrink-0" />
              {sidebarOpen && <span>{label}</span>}
            </Link>
          ))}
        </nav>

        {/* Bottom */}
        <div className="border-t border-[#1a1a1a] p-3 space-y-1">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2 text-xs text-[#555] hover:text-[#ccc] transition-colors rounded-sm hover:bg-[#1a1a1a]"
          >
            <FiHome size={14} />
            {sidebarOpen && "View Site"}
          </Link>
          <button
            onClick={() => signOut()}
            className="w-full flex items-center gap-3 px-3 py-2 text-xs text-[#555] hover:text-[#e50914] transition-colors rounded-sm hover:bg-[#1a1a1a]"
          >
            <FiLogOut size={14} />
            {sidebarOpen && "Sign Out"}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? "ml-56" : "ml-14"}`}>
        <div className="min-h-screen">{children}</div>
      </main>
    </div>
  );
}
