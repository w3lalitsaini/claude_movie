"use client";

import { motion } from "framer-motion";
import { RiMoneyDollarBoxLine, RiBarChartGroupedLine, RiTrophyLine, RiFlashlightLine, RiInformationLine, RiPulseLine } from "react-icons/ri";

const mockEarnings = [
  { id: 1, title: "Avatar 3 Review: James Cameron's Masterpiece", revenue: 45.20, ctr: "8.4%", views: "12.5K" },
  { id: 2, title: "Top 10 Bollywood OTT Trends 2026", revenue: 32.10, ctr: "6.2%", views: "8.1K" },
  { id: 3, title: "Project Hail Mary: Everything We Know", revenue: 28.50, ctr: "12.1%", views: "4.2K" },
];

export default function EarningContent() {
  return (
    <div className="glass-panel rounded-3xl p-8 h-full flex flex-col relative overflow-hidden group">
      <div className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-3 font-display tracking-wider">
            <span className="p-2 bg-green-500/10 rounded-xl border border-green-500/20">
              <RiMoneyDollarBoxLine className="text-green-500" />
            </span>
            HIGH-YIELD ASSETS
          </h2>
          <p className="text-gray-500 text-xs mt-1 font-medium italic">Ranking content by net revenue and conversion velocity</p>
        </div>
      </div>

      <div className="flex-1 space-y-4 relative z-10">
        {mockEarnings.map((movie, idx) => (
          <motion.div 
            key={movie.id} 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="p-5 bg-white/5 border border-white/5 rounded-2xl group/card hover:bg-white/10 hover:border-white/10 transition-all cursor-pointer relative overflow-hidden"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-8 h-8 rounded-lg bg-black/40 border border-white/5 flex items-center justify-center text-[10px] font-black text-gray-500 group-hover/card:text-green-500 transition-colors">
                #{idx + 1}
              </div>
              <h3 className="text-xs font-black text-white truncate flex-1 uppercase tracking-tight group-hover/card:text-green-400">
                {movie.title}
              </h3>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              <StatItem label="Revenue" value={`$${movie.revenue}`} color="text-green-500" />
              <StatItem label="CTR" value={movie.ctr} color="text-cyan-400" />
              <StatItem label="Views" value={movie.views} color="text-gray-400" />
            </div>
            
            <div className="absolute top-0 right-0 w-16 h-16 bg-linear-to-bl from-green-500/5 to-transparent pointer-events-none" />
          </motion.div>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-white/5 relative z-10">
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-4 bg-linear-to-r from-green-500/10 to-emerald-500/10 hover:from-green-500 hover:to-emerald-600 border border-green-500/30 text-green-500 hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-xl hover:shadow-green-500/20"
        >
          <RiBarChartGroupedLine size={18} />
          Full Fiscal Audit Report
        </motion.button>
      </div>
      
      <div className="mt-6 flex items-center justify-center gap-2 text-[8px] text-gray-600 font-black uppercase tracking-[0.2em] relative z-10">
        <RiPulseLine className="animate-pulse" /> Live Yield Stream ACTIVE
      </div>
    </div>
  );
}

function StatItem({ label, value, color }: { label: string, value: string, color: string }) {
  return (
    <div className="p-2.5 bg-black/40 rounded-xl border border-white/5 text-center group-hover/card:border-white/10 transition-all">
      <p className="text-[8px] text-gray-600 font-black uppercase tracking-widest mb-1">{label}</p>
      <p className={`text-[11px] font-black ${color} tracking-tighter`}>{value}</p>
    </div>
  );
}
