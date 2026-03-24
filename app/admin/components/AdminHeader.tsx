"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { 
  FiBell, FiSearch, FiCommand, FiActivity, FiZap, 
  FiChevronDown, FiSettings, FiUser, FiLogOut 
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminHeader() {
  const { data: session } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-28 right-0 z-50 transition-all duration-300 border-b ${
        scrolled 
          ? "bg-[#080808]/90 backdrop-blur-xl border-[#1a1a1a] h-16" 
          : "bg-transparent border-transparent h-20"
      }`}
    >
      <div className="max-w-[1920px] mx-auto h-full px-6 flex items-center justify-between">
        {/* Left: Brand & Search */}
        <div className="flex items-center gap-12">
          <Link href="/admin" className="flex items-center gap-0 group">
            <span className="text-white font-display font-black text-2xl tracking-tighter uppercase group-hover:text-yellow-500 transition-colors">ATOZ</span>
            <span className="bg-yellow-500 text-black px-2 py-0.5 font-display font-black text-lg tracking-tighter uppercase ml-0.5">ADMIN</span>
          </Link>

          <div className="hidden xl:flex items-center bg-white/5 border border-white/10 rounded-full px-4 py-2 w-96 group focus-within:border-yellow-500/50 transition-all">
            <FiSearch className="text-gray-500 group-focus-within:text-yellow-500" />
            <input 
              type="text" 
              placeholder="Search neural database..." 
              className="bg-transparent border-none outline-none text-xs text-white placeholder-gray-600 ml-3 w-full font-medium"
            />
            <div className="flex items-center gap-1.5 px-1.5 py-0.5 bg-white/5 border border-white/10 rounded-sm text-[10px] text-gray-500 font-bold uppercase tracking-widest">
              <FiCommand size={10} /> K
            </div>
          </div>
        </div>

        {/* Right: Actions & Profile */}
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-4 border-r border-white/10 pr-6">
            <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-yellow-500 hover:border-yellow-500/30 transition-all relative">
              <FiZap size={18} />
              <div className="absolute top-2 right-2 w-2 h-2 bg-yellow-500 rounded-full border-2 border-[#080808]" />
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-yellow-500 hover:border-yellow-500/30 transition-all">
              <FiActivity size={18} />
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-yellow-500 hover:border-yellow-500/30 transition-all">
              <FiBell size={18} />
            </button>
          </div>

          <div className="relative">
            <button 
              onClick={() => setUserDropdown(!userDropdown)}
              className="flex items-center gap-3 pl-2 py-1.5 pr-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all"
            >
              <div className="w-9 h-9 bg-linear-to-br from-yellow-400 to-orange-600 rounded-xl flex items-center justify-center text-black font-black text-sm">
                {session?.user?.name?.charAt(0) || "A"}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-bold text-white leading-tight uppercase tracking-tighter">Root Master</p>
                <p className="text-[10px] text-gray-500 font-medium leading-tight">{session?.user?.email?.split('@')[0]}</p>
              </div>
              <FiChevronDown className={`text-gray-500 transition-transform ${userDropdown ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
              {userDropdown && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute top-14 right-0 w-64 bg-[#0a0a0a] border border-[#1a1a1a] rounded-3xl shadow-2xl overflow-hidden z-100"
                >
                  <div className="p-4 border-b border-[#1a1a1a] bg-white/2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center text-black font-black">
                        {session?.user?.name?.charAt(0) || "A"}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white leading-tight uppercase tracking-tighter">{session?.user?.name}</p>
                        <p className="text-xs text-gray-500 font-medium leading-tight">System Administrator</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-2">
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-2xl transition-all">
                      <FiUser size={16} className="text-yellow-500" />
                      Protocol Management
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-2xl transition-all">
                      <FiSettings size={16} className="text-blue-500" />
                      Core Settings
                    </button>
                    <div className="h-px bg-[#1a1a1a] my-2 mx-4" />
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-500/10 rounded-2xl transition-all">
                      <FiLogOut size={16} />
                      Terminate Session
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}
