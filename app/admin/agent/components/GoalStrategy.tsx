"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { RiFocus3Line, RiRoadMapLine, RiCompass3Line, RiCheckDoubleLine, RiInformationLine } from "react-icons/ri";

export default function GoalStrategy() {
  const [goals, setGoals] = useState({
    traffic: 100000,
    revenue: 1000,
    niche: "Bollywood + OTT + Hollywood Blocks"
  });

  return (
    <div className="glass-panel rounded-3xl p-8 h-full flex flex-col relative overflow-hidden group">
      <div className="mb-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-3 font-display tracking-wider">
            <span className="p-2 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
              <RiFocus3Line className="text-yellow-500" />
            </span>
            SYSTEM GOALS
          </h2>
          <p className="text-gray-500 text-xs mt-1 font-medium italic">Setting targets for traffic and revenue</p>
        </div>
      </div>

      <div className="space-y-8 flex-1 relative z-10">
        <div className="group/range">
          <div className="flex justify-between items-center mb-3">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
              Monthly Traffic Target
            </label>
            <span className="text-sm font-black text-yellow-500 font-mono tracking-tighter">
              {(goals.traffic / 1000).toFixed(0)}K <span className="text-[10px] text-gray-600">Views/mo</span>
            </span>
          </div>
          <input 
            type="range" 
            min="10000" 
            max="1000000" 
            step="10000"
            value={goals.traffic}
            onChange={(e) => setGoals({...goals, traffic: parseInt(e.target.value)})}
            className="w-full accent-yellow-500 h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer hover:bg-white/10 transition-all border border-white/5"
          />
        </div>

        <div className="group/range">
          <div className="flex justify-between items-center mb-3">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
              Monthly Revenue Target
            </label>
            <span className="text-sm font-black text-green-500 font-mono tracking-tighter">
              ${goals.revenue.toLocaleString()} <span className="text-[10px] text-gray-600">USD</span>
            </span>
          </div>
          <input 
            type="range" 
            min="100" 
            max="10000" 
            step="100"
            value={goals.revenue}
            onChange={(e) => setGoals({...goals, revenue: parseInt(e.target.value)})}
            className="w-full accent-green-500 h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer hover:bg-white/10 transition-all border border-white/5"
          />
        </div>

        <div className="relative group/textarea">
          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 block">Content Focus Area</label>
          <RiCompass3Line className="absolute top-10 left-4 text-gray-600 group-focus-within/textarea:text-yellow-500 transition-colors pointer-events-none" />
          <textarea 
            value={goals.niche}
            onChange={(e) => setGoals({...goals, niche: e.target.value})}
            className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 pl-12 text-xs text-gray-300 font-bold focus:border-yellow-500/30 focus:bg-black/60 outline-none transition-all h-28 resize-none selection:bg-yellow-500/20"
          />
        </div>
      </div>

      <div className="mt-10 pt-8 border-t border-white/5 relative z-10">
        <div className="bg-linear-to-br from-yellow-500/10 to-transparent border border-yellow-500/20 p-5 rounded-2xl mb-8 relative group/roadmap overflow-hidden">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover/roadmap:opacity-20 transition-opacity">
            <RiRoadMapLine size={60} className="text-yellow-500" />
          </div>
          <p className="text-[10px] text-yellow-500 font-black uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
            AI Strategy Note
          </p>
          <p className="text-[11px] text-gray-400 italic leading-relaxed font-medium">
            "Focusing on popular Bollywood movie keywords and OTT releases to get more clicks and ad revenue."
          </p>
        </div>
        
        <motion.button 
          whileHover={{ y: -2 }}
          whileTap={{ y: 0 }}
          className="w-full bg-linear-to-r from-yellow-400 to-orange-500 text-black font-black py-4 rounded-2xl transition-all shadow-xl shadow-yellow-500/20 hover:shadow-yellow-500/40 uppercase tracking-widest text-xs flex items-center justify-center gap-3"
        >
          <RiCheckDoubleLine size={20} />
          Save Goals
        </motion.button>
      </div>
      
      <div className="mt-6 flex items-center justify-center gap-2 text-[8px] text-gray-600 font-black uppercase tracking-[0.2em] relative z-10">
        <RiInformationLine /> Goals are updated across the system 
      </div>
    </div>
  );
}
