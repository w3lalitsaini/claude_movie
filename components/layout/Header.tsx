"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  FiSearch,
  FiZap,
  FiGlobe,
  FiTv,
  FiChevronDown,
  FiUser,
  FiLogOut,
  FiBookmark,
  FiHeart,
  FiSettings,
  FiMenu,
  FiX,
} from "react-icons/fi";

const genres = [
  "Action",
  "Drama",
  "Thriller",
  "Sci-Fi",
  "Romance",
  "Comedy",
  "Horror",
  "Adventure",
  "Animation",
  "Crime",
];
const years = Array.from({ length: 15 }, (_, i) => 2025 - i);

const bollywoodItems = [
  { label: "Latest Bollywood", href: "/movies?category=bollywood" },
  { label: "Bollywood 2025", href: "/movies?category=bollywood&year=2025" },
  { label: "Bollywood 2024", href: "/movies?category=bollywood&year=2024" },
  {
    label: "Bollywood Action",
    href: "/movies?category=bollywood&genre=Action",
  },
];

const hollywoodItems = [
  { label: "Latest Hollywood", href: "/movies?category=hollywood" },
  { label: "Hollywood 2025", href: "/movies?category=hollywood&year=2025" },
  { label: "Hollywood 2024", href: "/movies?category=hollywood&year=2024" },
  {
    label: "Hollywood Action",
    href: "/movies?category=hollywood&genre=Action",
  },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const router = useRouter();
  const { data: session } = useSession();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#080808]/97 shadow-[0_2px_20px_rgba(0,0,0,0.8)]"
          : "bg-[#0a0a0a]"
      }`}
      style={{ backdropFilter: scrolled ? "blur(12px)" : "none" }}
    >
      {/* Top bar */}
      <div className="border-b border-[#1a1a1a]">
        <div className="max-w-[1400px] mx-auto px-4 h-14 flex items-center gap-6">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <div className="flex items-center gap-0 font-display font-bold text-2xl tracking-wider">
              <span className="text-white uppercase">ATOZ</span>
              <span className="bg-[#e50914] text-white px-2 py-0.5 uppercase tracking-wider">
                MOVIES
              </span>
            </div>
          </Link>

          {/* Search */}
          <form
            onSubmit={handleSearch}
            className="flex-1 max-w-2xl mx-auto hidden md:flex items-center"
          >
            <div className="flex w-full bg-[#181818] border border-[#2a2a2a] rounded-sm overflow-hidden">
              <div className="flex items-center px-3 text-[#666]">
                <FiSearch size={16} />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for movies, series, or actors..."
                className="flex-1 bg-transparent text-sm text-white placeholder-[#555] py-2.5 outline-none"
              />
              <button
                type="submit"
                className="bg-[#1e1e1e] hover:bg-[#2a2a2a] text-[#aaa] text-xs font-semibold px-4 py-2.5 transition-colors uppercase tracking-wider border-l border-[#2a2a2a]"
              >
                Enter
              </button>
            </div>
          </form>

          {/* Auth buttons */}
          <div className="flex-shrink-0 flex items-center gap-3 ml-auto">
            {session ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() =>
                    setActiveDropdown(activeDropdown === "user" ? null : "user")
                  }
                  className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-[#ccc] hover:text-white transition-colors"
                >
                  <div className="w-7 h-7 bg-[#e50914] rounded-full flex items-center justify-center text-xs font-bold">
                    {session.user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden lg:block">
                    {session.user?.name?.split(" ")[0]}
                  </span>
                  <FiChevronDown size={12} />
                </button>
                {activeDropdown === "user" && (
                  <div className="absolute right-0 top-10 w-52 bg-[#111] border border-[#222] shadow-2xl rounded-sm overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-[#222]">
                      <p className="text-sm font-semibold text-white">
                        {session.user?.name}
                      </p>
                      <p className="text-xs text-[#666]">
                        {session.user?.email}
                      </p>
                    </div>
                    <Link
                      href="/user/profile"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#ccc] hover:text-white hover:bg-[#1a1a1a] transition-colors"
                    >
                      <FiUser size={14} /> Profile
                    </Link>
                    <Link
                      href="/user/watchlist"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#ccc] hover:text-white hover:bg-[#1a1a1a] transition-colors"
                    >
                      <FiBookmark size={14} /> Watchlist
                    </Link>
                    <Link
                      href="/user/favorites"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#ccc] hover:text-white hover:bg-[#1a1a1a] transition-colors"
                    >
                      <FiHeart size={14} /> Favorites
                    </Link>
                    {session.user?.role === "admin" && (
                      <Link
                        href="/admin"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#e50914] hover:bg-[#1a1a1a] transition-colors"
                      >
                        <FiSettings size={14} /> Admin Panel
                      </Link>
                    )}
                    <div className="border-t border-[#222]">
                      <button
                        onClick={() => signOut()}
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-[#ccc] hover:text-white hover:bg-[#1a1a1a] transition-colors"
                      >
                        <FiLogOut size={14} /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="hidden sm:block text-sm font-bold uppercase tracking-widest text-[#ccc] hover:text-white transition-colors"
                >
                  LOGIN
                </Link>
                <Link
                  href="/auth/register"
                  className="btn-red text-white text-sm font-bold uppercase tracking-widest px-5 py-2 rounded-sm"
                >
                  JOIN ATOZ
                </Link>
              </>
            )}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden text-[#ccc] hover:text-white transition-colors p-1"
            >
              {mobileOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Navigation bar */}
      <div
        className="bg-[#0d0d0d] border-b border-[#1a1a1a] hidden md:block"
        ref={dropdownRef}
      >
        <div className="max-w-[1400px] mx-auto px-4">
          <nav className="flex items-center h-11">
            <div className="flex items-center gap-1 flex-1">
              <NavLink
                href="/"
                icon={<FiZap size={13} className="text-[#e50914]" />}
                label="HOME"
                active
              />

              <DropdownNav
                label="DUAL AUDIO"
                active={activeDropdown === "dual"}
                onToggle={() =>
                  setActiveDropdown(activeDropdown === "dual" ? null : "dual")
                }
                items={[
                  {
                    label: "All Dual Audio",
                    href: "/movies?category=dual-audio",
                  },
                  {
                    label: "Dual Audio Action",
                    href: "/movies?category=dual-audio&genre=Action",
                  },
                  {
                    label: "Dual Audio 2025",
                    href: "/movies?category=dual-audio&year=2025",
                  },
                ]}
              />

              <DropdownNav
                label="BOLLYWOOD"
                active={activeDropdown === "bolly"}
                onToggle={() =>
                  setActiveDropdown(activeDropdown === "bolly" ? null : "bolly")
                }
                items={bollywoodItems}
              />

              <NavLink
                href="/movies?category=south-hindi"
                label="SOUTH HINDI"
              />

              <DropdownNav
                label="HOLLYWOOD"
                active={activeDropdown === "holly"}
                onToggle={() =>
                  setActiveDropdown(activeDropdown === "holly" ? null : "holly")
                }
                items={hollywoodItems}
              />

              <DropdownNav
                label="WEB SERIES"
                icon={<FiTv size={13} className="text-[#e50914]" />}
                active={activeDropdown === "web"}
                onToggle={() =>
                  setActiveDropdown(activeDropdown === "web" ? null : "web")
                }
                items={[
                  {
                    label: "All Web Series",
                    href: "/movies?category=web-series",
                  },
                  {
                    label: "Netflix Series",
                    href: "/movies?category=web-series&platform=Netflix",
                  },
                  {
                    label: "Amazon Prime",
                    href: "/movies?category=web-series&platform=Amazon Prime",
                  },
                  {
                    label: "Disney+ Hotstar",
                    href: "/movies?category=web-series&platform=Disney+ Hotstar",
                  },
                ]}
              />

              <DropdownNav
                label="GENRE"
                icon={<FiGlobe size={13} />}
                active={activeDropdown === "genre"}
                onToggle={() =>
                  setActiveDropdown(activeDropdown === "genre" ? null : "genre")
                }
                items={genres.map((g) => ({
                  label: g,
                  href: `/movies?genre=${g}`,
                }))}
                wide
              />

              <DropdownNav
                label="BY YEAR"
                active={activeDropdown === "year"}
                onToggle={() =>
                  setActiveDropdown(activeDropdown === "year" ? null : "year")
                }
                items={years.map((y) => ({
                  label: String(y),
                  href: `/movies?year=${y}`,
                }))}
                wide
              />
            </div>

            {/* Quality filters */}
            <div className="flex items-center gap-2 ml-auto pl-4 border-l border-[#222]">
              <span className="text-xs text-[#555] uppercase tracking-widest font-semibold">
                QUALITY:
              </span>
              {["4K", "1080P", "720P"].map((q) => (
                <Link
                  key={q}
                  href={`/movies?quality=${q}`}
                  className="text-xs text-[#aaa] hover:text-white font-bold uppercase tracking-wider hover:text-[#e50914] transition-colors"
                >
                  {q}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[#0d0d0d] border-b border-[#222]">
          <div className="px-4 py-3">
            <form onSubmit={handleSearch} className="flex gap-2 mb-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search movies..."
                className="flex-1 bg-[#181818] border border-[#2a2a2a] text-sm text-white placeholder-[#555] px-3 py-2 rounded-sm outline-none"
              />
              <button
                type="submit"
                className="btn-red text-white text-sm font-bold px-4 py-2 rounded-sm"
              >
                Go
              </button>
            </form>
            <div className="grid grid-cols-2 gap-1">
              {[
                { href: "/", label: "Home" },
                { href: "/movies?category=dual-audio", label: "Dual Audio" },
                { href: "/movies?category=bollywood", label: "Bollywood" },
                { href: "/movies?category=south-hindi", label: "South Hindi" },
                { href: "/movies?category=hollywood", label: "Hollywood" },
                { href: "/movies?category=web-series", label: "Web Series" },
                { href: "/search", label: "Search" },
                { href: "/blog", label: "Blog" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-sm text-[#ccc] hover:text-white hover:text-[#e50914] py-2 px-3 bg-[#141414] rounded-sm transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function NavLink({
  href,
  label,
  icon,
  active,
}: {
  href: string;
  label: string;
  icon?: React.ReactNode;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-1.5 px-3 h-11 text-xs font-bold uppercase tracking-widest transition-colors hover:text-[#e50914] ${
        active ? "text-[#e50914]" : "text-[#cccccc]"
      }`}
    >
      {icon}
      {label}
    </Link>
  );
}

function DropdownNav({
  label,
  icon,
  items,
  active,
  onToggle,
  wide,
}: {
  label: string;
  icon?: React.ReactNode;
  items: { label: string; href: string }[];
  active: boolean;
  onToggle: () => void;
  wide?: boolean;
}) {
  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className={`flex items-center gap-1.5 px-3 h-11 text-xs font-bold uppercase tracking-widest transition-colors hover:text-[#e50914] ${
          active ? "text-[#e50914]" : "text-[#cccccc]"
        }`}
      >
        {icon}
        {label}
        <FiChevronDown
          size={11}
          className={`transition-transform duration-200 ${active ? "rotate-180" : ""}`}
        />
      </button>
      {active && (
        <div
          className={`absolute top-11 left-0 bg-[#111] border border-[#222] shadow-2xl z-50 ${
            wide ? "grid grid-cols-2 w-48" : "w-52"
          }`}
        >
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onToggle}
              className="block px-4 py-2.5 text-xs text-[#aaa] hover:text-white hover:bg-[#1a1a1a] transition-colors uppercase tracking-wider font-semibold"
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
