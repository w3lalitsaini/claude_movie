"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  RiSettings2Line, 
  RiEdit2Line, 
  RiRefreshLine, 
  RiDeleteBin7Line, 
  RiFocus3Line, 
  RiMoneyDollarCircleLine, 
  RiDnaLine, 
  RiFlaskLine, 
  RiRocket2Line,
  RiCheckboxCircleLine,
  RiInformationLine
} from "react-icons/ri";

const features = [
  { id: "autoGen", name: "Auto Generate Content", icon: <RiEdit2Line />, color: "text-blue-400" },
  { id: "autoUpdate", name: "Auto Update Content", icon: <RiRefreshLine />, color: "text-cyan-400" },
  { id: "autoDelete", name: "Auto Delete Low Value", icon: <RiDeleteBin7Line />, color: "text-red-400" },
  { id: "seoOptimization", name: "SEO Optimization", icon: <RiFocus3Line />, color: "text-yellow-400" },
  { id: "monetization", name: "Monetization", icon: <RiMoneyDollarCircleLine />, color: "text-green-400" },
  { id: "metaImprovement", name: "Self Improvement", icon: <RiDnaLine />, color: "text-purple-400" },
  { id: "abTesting", name: "A/B Testing", icon: <RiFlaskLine />, color: "text-indigo-400" },
  { id: "socialDistribution", name: "Social Sharing", icon: <RiRocket2Line />, color: "text-orange-400" },
];

export default function FeatureToggles() {
  const [enabledFeatures, setEnabledFeatures] = useState(features.map(f => f.id));

  const toggleFeature = (id: string) => {
    setEnabledFeatures(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  return (
    <div className="glass-panel rounded-3xl p-8 h-full flex flex-col relative overflow-hidden group">
      <div className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-3 font-display tracking-wider">
            <span className="p-2 bg-gray-500/10 rounded-xl border border-gray-500/20">
              <RiSettings2Line className="text-gray-400" />
            </span>
            SYSTEM SETTINGS
          </h2>
          <p className="text-gray-500 text-xs mt-1 font-medium">Enable or disable AI features</p>
        </div>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto pr-2 custom-scrollbar relative z-10">
        {features.map((feature, idx) => (
          <motion.div 
            key={feature.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            className={`flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl transition-all group/item hover:bg-white/10 ${
              enabledFeatures.includes(feature.id) ? "border-white/10" : "opacity-60"
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`p-2 rounded-xl bg-black/40 border border-white/5 ${feature.color}`}>
                {feature.icon}
              </div>
              <span className="text-xs font-black text-white tracking-tight">
                {feature.name}
              </span>
            </div>
            
            <button 
              onClick={() => toggleFeature(feature.id)}
              className={`w-12 h-6 rounded-full relative transition-all duration-300 border border-white/10 ${
                enabledFeatures.includes(feature.id) ? "bg-linear-to-r from-green-500 to-emerald-600 shadow-[0_0_15px_rgba(16,185,129,0.3)]" : "bg-black/60"
              }`}
            >
              <motion.div 
                animate={{ x: enabledFeatures.includes(feature.id) ? 26 : 4 }}
                className="absolute top-1 w-3.5 h-3.5 bg-white rounded-full shadow-[0_0_5px_rgba(255,255,255,0.5)]" 
              />
            </button>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 pt-8 border-t border-white/5 relative z-10">
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-white text-black font-black py-4 rounded-2xl transition-all shadow-xl hover:bg-emerald-500 hover:text-white uppercase tracking-widest text-[10px] flex items-center justify-center gap-3"
        >
          <RiCheckboxCircleLine size={18} />
          Save Settings
        </motion.button>
      </div>

      <div className="mt-6 flex items-center justify-center gap-2 text-[8px] text-gray-600 font-black uppercase tracking-[0.2em] relative z-10">
        <RiInformationLine /> Settings are saved to the system 
      </div>
    </div>
  );
}
