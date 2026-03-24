"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiCpu, FiActivity, FiZap, FiSave, FiInfo, FiSearch, 
  FiEdit3, FiSettings, FiDollarSign, FiGlobe, FiTarget, FiTrendingUp 
} from "react-icons/fi";

const agents = [
  { id: "manager", name: "Manager", desc: "Sovereign Logic", icon: FiCpu, color: "text-yellow-500" },
  { id: "researcher", name: "Researcher", desc: "Deep Web Scraper", icon: FiSearch, color: "text-blue-500" },
  { id: "writer", name: "Writer", desc: "Ghost SEO Engine", icon: FiEdit3, color: "text-green-500" },
  { id: "optimizer", name: "Optimizer", desc: "LSI Structuring", icon: FiSettings, color: "text-purple-500" },
  { id: "monetizer", name: "Monetizer", desc: "Yield Maximizer", icon: FiDollarSign, color: "text-orange-500" },
  { id: "meta", name: "Meta", desc: "Self-Optimization", icon: FiActivity, color: "text-pink-500" },
  { id: "strategy", name: "Strategy", desc: "Global Roadmap", icon: FiGlobe, color: "text-cyan-500" },
  { id: "competitor", name: "Competitor", desc: "Market Sniping", icon: FiTarget, color: "text-red-500" },
];

export default function AgentControl() {
  const [activeAgents, setActiveAgents] = useState(agents.map(a => a.id));
  const [isSystemRunning, setIsSystemRunning] = useState(true);

  const toggleAgent = (id: string) => {
    setActiveAgents(prev => 
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  return (
    <div className="glass-panel rounded-3xl p-8 relative overflow-hidden group h-full">
      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
        <FiCpu size={160} className="text-white" />
      </div>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-6 relative z-10">
        <div>
          <h2 className="text-3xl font-black text-white flex items-center gap-4 font-display tracking-tighter uppercase">
            <span className="p-3 bg-yellow-500 text-black rounded-2xl shadow-[0_0_20px_rgba(234,179,8,0.3)]">
              <FiZap />
            </span>
            AI Workers
          </h2>
          <p className="text-gray-500 text-[10px] mt-2 font-bold uppercase tracking-[0.3em] font-mono">Autonomous Processing System</p>
        </div>
        
        <div className="flex gap-4">
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsSystemRunning(!isSystemRunning)}
            className={`px-8 py-3.5 rounded-2xl font-black text-[10px] tracking-widest uppercase transition-all flex items-center gap-3 border shadow-2xl ${
              isSystemRunning 
                ? "bg-red-500 text-white border-transparent shadow-red-500/20" 
                : "bg-yellow-500 text-black border-transparent shadow-yellow-500/20"
            }`}
          >
            {isSystemRunning ? "STOP AI" : "START AI"}
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-8 py-3.5 bg-white/5 text-gray-400 hover:text-white rounded-2xl font-black text-[10px] tracking-widest uppercase transition-all border border-white/10 hover:border-white/20"
            onClick={() => {
              if(confirm("🚨 WARNING: Clear all AI memory?")) {
                setIsSystemRunning(false);
                setActiveAgents([]);
              }
            }}
          >
            RESET SYSTEM
          </motion.button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 gap-4 relative z-10">
        {agents.map((agent) => {
          const isActive = activeAgents.includes(agent.id);
          const Icon = agent.icon;
          return (
            <motion.div 
              key={agent.id}
              initial={false}
              animate={{ 
                backgroundColor: isActive ? "rgba(255, 255, 255, 0.05)" : "rgba(255, 255, 255, 0.02)",
                borderColor: isActive ? "rgba(234, 179, 8, 0.4)" : "rgba(255, 255, 255, 0.05)"
              }}
              whileHover={{ y: -4, borderColor: isActive ? "rgba(234, 179, 8, 0.6)" : "rgba(255, 255, 255, 0.15)" }}
              className="p-6 rounded-3xl border transition-all cursor-pointer relative overflow-hidden flex flex-col items-center text-center group/card"
              onClick={() => toggleAgent(agent.id)}
            >
              <div className="absolute top-3 right-3">
                <div className={`w-2 h-2 rounded-full ${
                  isActive ? "bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.8)] animate-pulse" : "bg-gray-800"
                }`} />
              </div>
              
              <div className={`p-4 rounded-2xl bg-white/5 mb-4 group-hover/card:scale-110 transition-transform ${agent.color}`}>
                <Icon size={24} />
              </div>
              
              <span className="font-black text-xs text-white tracking-widest uppercase truncate w-full px-1">
                {agent.name}
              </span>
              <p className="text-[10px] text-gray-500 uppercase tracking-tighter mt-2 font-bold whitespace-nowrap overflow-hidden text-ellipsis w-full">
                {agent.desc}
              </p>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row gap-6 relative z-10">
        <motion.button 
          whileHover={{ y: -4, scale: 1.01 }}
          whileTap={{ y: 0, scale: 0.99 }}
          className="flex-1 bg-yellow-500 text-black font-black py-4 rounded-2xl transition-all shadow-[0_0_30px_rgba(234,179,8,0.2)] hover:shadow-[0_0_40px_rgba(234,179,8,0.4)] uppercase tracking-widest text-xs flex items-center justify-center gap-3"
        >
          <FiZap size={20} />
          Sync AI Now
        </motion.button>
        
        <motion.button 
          whileHover={{ y: -4 }}
          whileTap={{ y: 0 }}
          className="px-10 glass-panel text-white font-black py-4 rounded-2xl transition-all border-white/10 hover:border-white/20 uppercase tracking-widest text-[10px] flex items-center justify-center gap-3"
        >
          <FiSave size={18} />
          Save Changes
        </motion.button>
      </div>
      
      <div className="mt-6 flex items-center justify-center gap-2 opacity-50 text-[10px] font-bold text-gray-500 tracking-[0.3em] uppercase font-mono">
        <FiInfo />
        Secure Connection Active
      </div>
    </div>
  );
}
