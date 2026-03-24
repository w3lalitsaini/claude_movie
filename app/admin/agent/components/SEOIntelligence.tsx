"use client";

import { motion } from "framer-motion";
import { RiSearchEyeLine, RiArrowUpSLine, RiArrowDownSLine, RiSubtractLine, RiFlashlightLine, RiInformationLine } from "react-icons/ri";

const mockSeoStats = {
  impressions: "1.2M",
  ctr: "4.8%",
  clicks: "58K",
  topKeywords: [
    { word: "project hail mary review", position: 1.2, trend: "up" },
    { word: "best sci-fi movies 2026", position: 3.5, trend: "up" },
    { word: "the bride (2025) release", position: 2.1, trend: "stable" },
    { word: "bollywood ott trends", position: 5.8, trend: "down" },
  ]
};

export default function SEOIntelligence() {
  return (
    <div className="glass-panel rounded-3xl p-8 h-full flex flex-col relative overflow-hidden group">
      <div className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-3 font-display tracking-wider">
            <span className="p-2 bg-purple-500/10 rounded-xl border border-purple-500/20">
              <RiSearchEyeLine className="text-purple-500" />
            </span>
            SEO STATS
          </h2>
          <p className="text-gray-500 text-xs mt-1 font-medium italic">Google Search rankings and traffic</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-10 relative z-10">
        <StatTile label="Impressions" value={mockSeoStats.impressions} color="text-blue-400" />
        <StatTile label="Click Rate" value={mockSeoStats.ctr} color="text-green-400" />
        <StatTile label="Total Clicks" value={mockSeoStats.clicks} color="text-purple-400" />
      </div>

      <div className="flex-1 space-y-4 relative z-10">
        <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest border-b border-white/5 pb-3 mb-2 flex items-center gap-2">
          Top Performing Keywords
        </h3>
        <div className="space-y-2">
          {mockSeoStats.topKeywords.map((kw, idx) => (
            <motion.div 
              key={idx} 
              whileHover={{ x: 4, backgroundColor: "rgba(255, 255, 255, 0.05)" }}
              className="flex items-center justify-between p-3 rounded-xl border border-transparent transition-all cursor-crosshair group/item"
            >
              <span className="text-xs text-white font-black tracking-tight">{kw.word}</span>
              <div className="flex items-center gap-6">
                <span className="text-[10px] font-mono text-gray-500 font-bold">
                  POS: <span className="text-white">{kw.position}</span>
                </span>
                <TrendIcon trend={kw.trend} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="mt-8 bg-linear-to-br from-blue-500/10 to-transparent border border-blue-500/20 p-5 rounded-2xl relative z-10">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[10px] text-blue-400 font-black uppercase tracking-widest flex items-center gap-2">
            <RiFlashlightLine className="animate-pulse" /> Growth Speed
          </p>
          <p className="text-sm font-black text-green-500">+12.4%</p>
        </div>
        <p className="text-[9px] text-gray-400 font-bold mb-3">Search ranking performance</p>
        <div className="h-1.5 bg-black/40 rounded-full overflow-hidden border border-white/5">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: "65%" }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="h-full bg-linear-to-r from-blue-600 to-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.4)]" 
          />
        </div>
      </div>
      
      <div className="mt-6 flex items-center gap-2 text-[8px] text-gray-600 font-black uppercase tracking-widest relative z-10">
        <RiInformationLine /> SEO data is live
      </div>
    </div>
  );
}

function StatTile({ label, value, color }: any) {
  return (
    <div className="p-4 bg-white/5 border border-white/5 rounded-2xl text-center group/tile hover:border-white/10 transition-all">
      <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest mb-1.5">{label}</p>
      <p className={`text-xl font-black ${color} tracking-tighter`}>{value}</p>
    </div>
  );
}

function TrendIcon({ trend }: { trend: string }) {
  if (trend === "up") return <RiArrowUpSLine className="text-green-500 animate-bounce" size={18} />;
  if (trend === "down") return <RiArrowDownSLine className="text-red-500 animate-bounce" style={{ animationDirection: 'reverse' }} size={18} />;
  return <RiSubtractLine className="text-gray-500 opacity-30" size={18} />;
}
